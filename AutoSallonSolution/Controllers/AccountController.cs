using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharedClassLibrary.Contracts;
using SharedClassLibrary.DTOs;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading.Tasks;
using AutoSallonSolution.Data;
using System.Net;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using System;

namespace AutoSallonSolution.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserAccount userAccount;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public AccountController(IUserAccount userAccount, ApplicationDbContext context, IConfiguration config)
        {
            this.userAccount = userAccount;
            _context = context;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDTO userDTO)
        {
            try
            {
                if (userDTO == null)
                {
                    return BadRequest(new { message = "Invalid registration data" });
                }

                if (string.IsNullOrWhiteSpace(userDTO.Name))
                {
                    return BadRequest(new { message = "Name is required" });
                }

                if (string.IsNullOrWhiteSpace(userDTO.Email))
                {
                    return BadRequest(new { message = "Email is required" });
                }

                if (string.IsNullOrWhiteSpace(userDTO.Password))
                {
                    return BadRequest(new { message = "Password is required" });
                }

                if (userDTO.Password != userDTO.ConfirmPassword)
                {
                    return BadRequest(new { message = "Passwords do not match" });
                }

                var response = await userAccount.CreateAccount(userDTO);

                if (!response.Flag)
                {
                    return BadRequest(response);
                }

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration. Please try again later." });
            }
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Verification token is missing" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailConfirmationToken == token);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid verification token" });
            }

            if (user.IsEmailConfirmed)
            {
                return BadRequest(new { message = "Email is already verified" });
            }

            user.IsEmailConfirmed = true;
            user.EmailConfirmationToken = null;
            user.EmailConfirmationTokenCreatedAt = null;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Email verified successfully" });
        }




        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            var response = await userAccount.LoginAccount(loginDTO);
            if (!response.Flag)
            {
                return Unauthorized(response);
            }

            // Generate refresh token and set cookie
            var refreshToken = GenerateRefreshToken();
            SetRefreshToken(refreshToken);

            // Store refresh token in database
            // Note: LoginResponse does not have UserId, get userId from userAccount or loginDTO
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDTO.Email);
            if (user != null)
            {
                await userAccount.StoreRefreshToken(user.Id, refreshToken);
            }

            return Ok(new { token = response.Token });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken))
            {
                return Unauthorized(new { message = "Refresh token is missing" });
            }

            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "Authorization header is missing or invalid" });
            }
            var token = authHeader.Replace("Bearer ", "");

            var principal = GetPrincipalFromExpiredToken(token);
            if (principal == null)
            {
                return Unauthorized(new { message = "Invalid token" });
            }

            var userId = principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized(new { message = "Invalid token claims" });
            }

            var isValid = await userAccount.ValidateRefreshToken(refreshToken, userId);
            if (!isValid)
            {
                return Unauthorized(new { message = "Invalid refresh token" });
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }

            var userRole = (await userAccount.GetUsers()).Find(u => u.Id == userId)?.Role ?? "User";
            var newToken = userAccount.GenerateToken(new UserSession(user.Id, user.UserName, user.Email, userRole));

            // Generate new refresh token and set cookie
            var newRefreshToken = GenerateRefreshToken();
            SetRefreshToken(newRefreshToken);
            await userAccount.StoreRefreshToken(userId, newRefreshToken);

            return Ok(new { token = newToken });
        }

        private RefreshToken GenerateRefreshToken()
        {
            return new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expired = DateTime.Now.AddDays(7),
                Created = DateTime.Now
            };
        }

        private void SetRefreshToken(RefreshToken newRefreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = newRefreshToken.Expired
            };
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);
        }

        private System.Security.Claims.ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateAudience = true,
                ValidateIssuer = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["Jwt:Key"])),
                ValidateLifetime = false, // We want to get claims from expired token
                ValidIssuer = _config["Jwt:Issuer"],
                ValidAudience = _config["Jwt:Audience"]
            };

            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
                if (securityToken is System.IdentityModel.Tokens.Jwt.JwtSecurityToken jwtSecurityToken &&
                    jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return principal;
                }
            }
            catch
            {
                return null;
            }
            return null;
        }
    }
}


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SharedClassLibrary.Contracts;
using SharedClassLibrary.DTOs;
using AutoSallonSolution.Data;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;  // Added for specifying authentication scheme in [Authorize]

namespace AutoSallonSolution.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserAccount userAccount;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AccountController(
            IUserAccount userAccount,
            ApplicationDbContext context,
            IConfiguration config,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager)
        {
            this.userAccount = userAccount;
            _context = context;
            _config = config;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDTO userDTO)
        {
            if (userDTO == null) return BadRequest(new { message = "Invalid registration data" });
            var response = await userAccount.CreateAccount(userDTO);
            if (!response.Flag) return BadRequest(response);
            return Ok(response);
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            if (string.IsNullOrEmpty(token)) return BadRequest(new { message = "Verification token is missing" });
            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailConfirmationToken == token);
            if (user == null) return BadRequest(new { message = "Invalid verification token" });
            if (user.IsEmailConfirmed) return BadRequest(new { message = "Email is already verified" });
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
            if (!response.Flag) return Unauthorized(response);
            var refreshToken = GenerateRefreshToken();
            SetRefreshToken(refreshToken);
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDTO.Email);
            if (user != null) await userAccount.StoreRefreshToken(user.Id, refreshToken);
            return Ok(new { token = response.Token });
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            if (!Request.Cookies.TryGetValue("refreshToken", out var oldRefreshToken))
                return Unauthorized(new { message = "Refresh token is missing" });

            var authHeader = Request.Headers["Authorization"].ToString();
            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return Unauthorized(new { message = "Authorization header is missing or invalid" });

            var principal = GetPrincipalFromExpiredToken(authHeader.Replace("Bearer ", ""));
            if (principal == null) return Unauthorized(new { message = "Invalid token" });

            var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized(new { message = "Invalid token claims" });

            if (!await userAccount.ValidateRefreshToken(oldRefreshToken, userId))
                return Unauthorized(new { message = "Invalid refresh token" });

            var oldToken = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == oldRefreshToken);
            if (oldToken != null)
            {
                _context.RefreshTokens.Remove(oldToken);
                await _context.SaveChangesAsync();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return Unauthorized(new { message = "User not found" });

            var userRole = (await userAccount.GetUsers()).FirstOrDefault(u => u.Id == userId)?.Role ?? "User";
            var newToken = userAccount.GenerateToken(new UserSession(user.Id, user.UserName, user.Email, userRole));

            var newRefreshToken = GenerateRefreshToken();
            SetRefreshToken(newRefreshToken);
            await userAccount.StoreRefreshToken(userId, newRefreshToken);

            return Ok(new { token = newToken });
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            var userList = new List<object>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                userList.Add(new { user.Id, user.UserName, user.Email, Roles = roles });
            }
            return Ok(userList);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "Admin")]
        [HttpPost("users/{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(string userId, [FromBody] string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound(new { message = "User not found" });
            if (!await _roleManager.RoleExistsAsync(role)) return BadRequest(new { message = "Role does not exist" });
            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            await _userManager.AddToRoleAsync(user, role);
            return Ok(new { message = "User role updated successfully" });
        }

        // Helper Methods
        private RefreshToken GenerateRefreshToken()
        {
            return new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expired = DateTime.UtcNow.AddDays(7),
                Created = DateTime.UtcNow
            };
        }

        private void SetRefreshToken(RefreshToken newRefreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = new DateTimeOffset(newRefreshToken.Expired)
            };
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);
        }

        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)),
                ValidIssuer = _config["Jwt:Issuer"],
                ValidAudience = _config["Jwt:Audience"],
                ValidateLifetime = false
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            try
            {
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
                if (securityToken is JwtSecurityToken jwt && jwt.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return principal;
                }
            }
            catch { }
            return null;
        }
    }
}

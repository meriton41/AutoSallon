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
using System.Net; // ✅ Add this for ApplicationDbContext

namespace AutoSallonSolution.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IUserAccount userAccount;
        private readonly ApplicationDbContext _context; // ✅ Add this

        // ✅ Inject ApplicationDbContext
        public AccountController(IUserAccount userAccount, ApplicationDbContext context)
        {
            this.userAccount = userAccount;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserDTO userDTO)
        {
            try
            {
                Console.WriteLine("📝 Starting registration for: " + userDTO.Email);

                if (userDTO == null)
                {
                    Console.WriteLine("❌ Registration failed: UserDTO is null");
                    return BadRequest(new { message = "Invalid registration data" });
                }

                // Validate required fields
                if (string.IsNullOrWhiteSpace(userDTO.Name))
                {
                    Console.WriteLine("❌ Registration failed: Name is required");
                    return BadRequest(new { message = "Name is required" });
                }

                if (string.IsNullOrWhiteSpace(userDTO.Email))
                {
                    Console.WriteLine("❌ Registration failed: Email is required");
                    return BadRequest(new { message = "Email is required" });
                }

                if (string.IsNullOrWhiteSpace(userDTO.Password))
                {
                    Console.WriteLine("❌ Registration failed: Password is required");
                    return BadRequest(new { message = "Password is required" });
                }

                if (userDTO.Password != userDTO.ConfirmPassword)
                {
                    Console.WriteLine("❌ Registration failed: Passwords do not match");
                    return BadRequest(new { message = "Passwords do not match" });
                }

                var response = await userAccount.CreateAccount(userDTO);

                if (!response.Flag)
                {
                    Console.WriteLine($"❌ Registration failed: {response.Message}");
                    return BadRequest(response);
                }

                Console.WriteLine("✅ Registration successful for: " + userDTO.Email);
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Registration error: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "An error occurred during registration. Please try again later." });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO loginDTO)
        {
            var response = await userAccount.LoginAccount(loginDTO);
            var refreshToken = GenerateRefreshToken();
            SetRefreshToken(refreshToken);
            return Ok(response);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await userAccount.GetUsers();
            return Ok(users);
        }

        [HttpPatch("update/{id}")]
        public async Task<IActionResult> UpdateUser(string id, UserDetailsDTO userDetailsDTO)
        {
            var response = await userAccount.UpdateUser(id, userDetailsDTO);
            if (!response.Flag)
                return BadRequest(response);

            return Ok(response);
        }

        private RefreshToken GenerateRefreshToken()
        {
            var refreshToken = new RefreshToken
            {
                Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Expired = DateTime.Now.AddDays(7),
                Created = DateTime.Now
            };

            return refreshToken;
        }

        private void SetRefreshToken(RefreshToken newRefreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = newRefreshToken.Expired
            };
            Response.Cookies.Append("refreshToken", newRefreshToken.Token, cookieOptions);
        }
        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail([FromQuery] string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                Console.WriteLine("❌ Token is missing from the request.");
                return BadRequest(new { message = "Token is missing" });
            }

            Console.WriteLine("👉 Received token: " + token);

            // Handle double-encoded tokens
            var decodedToken = WebUtility.UrlDecode(token);
            Console.WriteLine("👉 First decode: " + decodedToken);

            // If the token still contains encoded characters, decode it again
            if (decodedToken.Contains("%"))
            {
                decodedToken = WebUtility.UrlDecode(decodedToken);
                Console.WriteLine("👉 Second decode: " + decodedToken);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailConfirmationToken == decodedToken);

            if (user == null)
            {
                Console.WriteLine("❌ No user found with matching token.");
                Console.WriteLine("🔍 Looking for token: " + decodedToken);
                return NotFound(new { message = "Invalid or expired token" });
            }

            Console.WriteLine("✅ Found user with matching token: " + user.Email);
            Console.WriteLine("📬 Token from DB: " + user.EmailConfirmationToken);
            Console.WriteLine("⏰ Token creation time: " + user.EmailConfirmationTokenCreatedAt);

            // Check if token has expired (24 hours)
            if (user.EmailConfirmationTokenCreatedAt.HasValue &&
                (DateTime.UtcNow - user.EmailConfirmationTokenCreatedAt.Value).TotalHours > 24)
            {
                Console.WriteLine("❌ Token has expired.");
                // Clear expired token
                user.EmailConfirmationToken = null;
                user.EmailConfirmationTokenCreatedAt = null;
                await _context.SaveChangesAsync();
                return BadRequest(new { message = "Token has expired. Please request a new verification email." });
            }

            if (user.IsEmailConfirmed)
            {
                Console.WriteLine("ℹ️ Email already verified.");
                return Ok(new { message = "Email already verified" });
            }

            // Clear token and its creation time after successful verification
            user.IsEmailConfirmed = true;
            user.EmailConfirmationToken = null;
            user.EmailConfirmationTokenCreatedAt = null;

            await _context.SaveChangesAsync();

            Console.WriteLine("✅ Email verified successfully for user: " + user.Email);

            return Ok(new { message = "Email verified successfully" });
        }



    }
}

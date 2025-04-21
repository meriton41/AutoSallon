using AutoSallonSolution.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SharedClassLibrary.Contracts;
using SharedClassLibrary.DTOs;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static SharedClassLibrary.DTOs.ServiceResponses;
using AutoSallonSolution.Services;
using System.Net;

public class AccountRepository : IUserAccount
{
    private readonly UserManager<ApplicationUser> userManager;
    private readonly RoleManager<IdentityRole> roleManager;
    private readonly IConfiguration config;
    private readonly EmailService emailService;

    public AccountRepository(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        IConfiguration config,
        EmailService emailService)
    {
        this.userManager = userManager;
        this.roleManager = roleManager;
        this.config = config;
        this.emailService = emailService;
    }

    public async Task<GeneralResponse> CreateAccount(UserDTO userDTO)
    {
        try
        {
            Console.WriteLine("📝 Starting account creation for: " + userDTO.Email);

            if (userDTO is null)
            {
                Console.WriteLine("❌ Account creation failed: UserDTO is null");
                return new GeneralResponse(false, "Model is empty");
            }

            var existingUser = await userManager.FindByEmailAsync(userDTO.Email);
            if (existingUser != null)
            {
                Console.WriteLine("❌ Account creation failed: User already exists - " + userDTO.Email);
                return new GeneralResponse(false, "User already registered");
            }

            // Generate and assign email confirmation token
            var token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
            var encodedToken = WebUtility.UrlEncode(token);

            Console.WriteLine("🔐 Raw token stored in DB: " + token);
            Console.WriteLine("📧 Encoded token sent in email: " + encodedToken);
            Console.WriteLine("🔍 Decoded token (should match raw): " + WebUtility.UrlDecode(encodedToken));

            var newUser = new ApplicationUser
            {
                Name = userDTO.Name,
                Email = userDTO.Email,
                UserName = userDTO.Email,
                IsEmailConfirmed = false,
                EmailConfirmationToken = token,
                EmailConfirmationTokenCreatedAt = DateTime.UtcNow
            };

            Console.WriteLine("👤 Creating user in database...");
            var createUserResult = await userManager.CreateAsync(newUser, userDTO.Password);

            if (!createUserResult.Succeeded)
            {
                var errors = string.Join(", ", createUserResult.Errors.Select(e => e.Description));
                Console.WriteLine($"❌ User creation failed: {errors}");
                return new GeneralResponse(false, $"Error occurred during user creation: {errors}");
            }

            Console.WriteLine("✅ User created successfully, sending verification email...");
            await emailService.SendVerificationEmailAsync(newUser.Email, encodedToken);

            // Assign role
            var isFirstUser = (await userManager.Users.CountAsync()) == 1;
            var roleName = isFirstUser ? "Admin" : "User";

            if (!await roleManager.RoleExistsAsync(roleName))
            {
                Console.WriteLine("👥 Creating role: " + roleName);
                var roleResult = await roleManager.CreateAsync(new IdentityRole(roleName));
                if (!roleResult.Succeeded)
                {
                    var errors = string.Join(", ", roleResult.Errors.Select(e => e.Description));
                    Console.WriteLine($"❌ Role creation failed: {errors}");
                    return new GeneralResponse(false, $"Error creating role: {errors}");
                }
            }

            Console.WriteLine("👥 Adding user to role: " + roleName);
            var addToRoleResult = await userManager.AddToRoleAsync(newUser, roleName);
            if (!addToRoleResult.Succeeded)
            {
                var errors = string.Join(", ", addToRoleResult.Errors.Select(e => e.Description));
                Console.WriteLine($"❌ Role assignment failed: {errors}");
                return new GeneralResponse(false, $"Error adding user to role: {errors}");
            }

            Console.WriteLine("✅ Account creation completed successfully for: " + userDTO.Email);
            return new GeneralResponse(true, "Account Created. Please verify your email.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Account creation error: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return new GeneralResponse(false, $"An error occurred during account creation: {ex.Message}");
        }
    }

    public async Task<LoginResponse> LoginAccount(LoginDTO loginDTO)
    {
        if (loginDTO == null)
            return new LoginResponse(false, null, "Login container is empty");

        var getUser = await userManager.FindByEmailAsync(loginDTO.Email);
        if (getUser == null)
            return new LoginResponse(false, null, "User not found");

        if (string.IsNullOrEmpty(getUser.Email) || string.IsNullOrEmpty(getUser.UserName))
            return new LoginResponse(false, null, "User data is incomplete");

        if (!getUser.IsEmailConfirmed)
            return new LoginResponse(false, null, "Please verify your email before logging in.");

        bool checkUserPasswords = await userManager.CheckPasswordAsync(getUser, loginDTO.Password);
        if (!checkUserPasswords)
            return new LoginResponse(false, null, "Invalid email/password");

        var getUserRole = await userManager.GetRolesAsync(getUser);
        if (getUserRole == null || !getUserRole.Any())
            return new LoginResponse(false, null, "User has no assigned roles");

        var userSession = new UserSession(getUser.Id, getUser.UserName, getUser.Email, getUserRole.First());
        string token = GenerateToken(userSession);

        return new LoginResponse(true, token, "Login completed");
    }

    public async Task<List<UserDetailsDTO>> GetUsers()
    {
        var users = await userManager.Users.ToListAsync();
        var userDetails = new List<UserDetailsDTO>();

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);
            userDetails.Add(new UserDetailsDTO
            {
                Id = user.Id,
                Name = user.Name ?? string.Empty,
                Email = user.Email ?? string.Empty,
                Role = roles.FirstOrDefault() ?? string.Empty
            });
        }

        return userDetails;
    }

    public async Task<GeneralResponse> UpdateUser(string userId, UserDetailsDTO userDetailsDTO)
    {
        if (userDetailsDTO == null)
            return new GeneralResponse(false, "Model is empty");

        var user = await userManager.FindByIdAsync(userId);
        if (user == null)
            return new GeneralResponse(false, "User not found");

        user.Name = userDetailsDTO.Name;
        user.Email = userDetailsDTO.Email;
        user.UserName = userDetailsDTO.Email;

        var updateUserResult = await userManager.UpdateAsync(user);
        if (!updateUserResult.Succeeded)
        {
            var errors = string.Join(", ", updateUserResult.Errors.Select(e => e.Description));
            return new GeneralResponse(false, $"Error updating user: {errors}");
        }

        if (!string.IsNullOrEmpty(userDetailsDTO.Role))
        {
            var currentRoles = await userManager.GetRolesAsync(user);
            var removeFromRolesResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
            if (!removeFromRolesResult.Succeeded)
            {
                var errors = string.Join(", ", removeFromRolesResult.Errors.Select(e => e.Description));
                return new GeneralResponse(false, $"Error removing user from roles: {errors}");
            }

            var addToRoleResult = await userManager.AddToRoleAsync(user, userDetailsDTO.Role);
            if (!addToRoleResult.Succeeded)
            {
                var errors = string.Join(", ", addToRoleResult.Errors.Select(e => e.Description));
                return new GeneralResponse(false, $"Error adding user to role: {errors}");
            }
        }

        return new GeneralResponse(true, "User updated successfully");
    }

    private string GenerateToken(UserSession user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var userClaims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };
        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: userClaims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: credentials
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

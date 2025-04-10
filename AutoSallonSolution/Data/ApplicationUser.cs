using Microsoft.AspNetCore.Identity;

namespace AutoSallonSolution.Data
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
        public bool IsEmailConfirmed { get; set; } = false;

        public string? EmailConfirmationToken { get; set; }
    }
}

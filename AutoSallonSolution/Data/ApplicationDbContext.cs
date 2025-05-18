using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SharedClassLibrary.DTOs;
using AutoSallonSolution.Models;

namespace AutoSallonSolution.Data
{
    using SharedClassLibrary.DTOs;

    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<ApplicationUser> Users { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<FavoriteVehicle> FavoriteVehicles { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Vehicle>()
                .Property(v => v.Price)
                .HasColumnType("decimal(18,2)");

            // Configure FavoriteVehicle relationships
            builder.Entity<FavoriteVehicle>()
                .HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<FavoriteVehicle>()
                .HasOne<Vehicle>()
                .WithMany()
                .HasForeignKey(f => f.VehicleId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}

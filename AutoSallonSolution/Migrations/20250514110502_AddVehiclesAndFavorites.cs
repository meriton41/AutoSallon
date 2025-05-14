using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AutoSallonSolution.Migrations
{
    /// <inheritdoc />
    public partial class AddVehiclesAndFavorites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Features",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "IsNew",
                table: "Vehicles");

            migrationBuilder.AddColumn<decimal>(
                name: "Price",
                table: "Vehicles",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Price",
                table: "Vehicles");

            migrationBuilder.AddColumn<string>(
                name: "Features",
                table: "Vehicles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsNew",
                table: "Vehicles",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}

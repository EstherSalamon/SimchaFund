using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimchaFund.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveTotal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalCollected",
                table: "Simchos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "TotalCollected",
                table: "Simchos",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}

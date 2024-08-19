using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimchaFund.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveInitialDeposit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InitialDeposit",
                table: "Contributors");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "InitialDeposit",
                table: "Contributors",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SimchaFund.Data.Migrations
{
    /// <inheritdoc />
    public partial class SimchaId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SimchaId",
                table: "Actions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SimchaId",
                table: "Actions");
        }
    }
}

using Microsoft.EntityFrameworkCore;

namespace SimchaFund.Data;

public class SimchosDataContext : DbContext
{
    private readonly string _connectionString;

    public SimchosDataContext(string connectionString)
    {
        _connectionString = connectionString;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(_connectionString);
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
        {
            relationship.DeleteBehavior = DeleteBehavior.Restrict;
        }
    }

    public DbSet<Contributor> Contributors { get; set; }
    public DbSet<Simcha> Simchos { get; set; }
    public DbSet<OneAction> Actions { get; set; }
}
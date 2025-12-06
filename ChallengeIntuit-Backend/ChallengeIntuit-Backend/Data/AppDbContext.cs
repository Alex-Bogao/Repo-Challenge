using Microsoft.EntityFrameworkCore;
using ChallengeIntuit.Backend.Models; 

namespace ChallengeIntuit.Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Cliente> Clientes { get; set; }
    }
}
using GuestService.Models;
using Microsoft.EntityFrameworkCore;

namespace GuestService.Data
{
    public class GuestDbContext : DbContext
    {
        public GuestDbContext(DbContextOptions<GuestDbContext> options) : base(options)
        {
        }

        public DbSet<Guest> Guests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Guest>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MemberCode).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Company).HasMaxLength(200);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Gender).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(500);
                entity.HasIndex(e => e.MemberCode).IsUnique();
            });
        }
    }
}

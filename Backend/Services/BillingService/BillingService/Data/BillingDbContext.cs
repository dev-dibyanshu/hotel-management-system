using BillingService.Models;
using Microsoft.EntityFrameworkCore;

namespace BillingService.Data
{
    public class BillingDbContext : DbContext
    {
        public BillingDbContext(DbContextOptions<BillingDbContext> options) : base(options)
        {
        }

        public DbSet<Payment> Payments { get; set; }
        public DbSet<Bill> Bills { get; set; }
        public DbSet<BillItem> BillItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Total).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PaymentTime).IsRequired();
                entity.Property(e => e.CreditCardDetails).IsRequired().HasMaxLength(500);
            });

            modelBuilder.Entity<Bill>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.BillingNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Date).IsRequired();
                entity.HasIndex(e => e.BillingNumber).IsUnique();
            });

            modelBuilder.Entity<BillItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantity).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Taxes).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Services).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Unit).IsRequired().HasMaxLength(50);
                
                entity.HasOne(e => e.Bill)
                    .WithMany(b => b.BillItems)
                    .HasForeignKey(e => e.BillId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}

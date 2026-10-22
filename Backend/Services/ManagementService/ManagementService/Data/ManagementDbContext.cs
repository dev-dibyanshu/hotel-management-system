using ManagementService.Models;
using Microsoft.EntityFrameworkCore;

namespace ManagementService.Data
{
    public class ManagementDbContext : DbContext
    {
        public ManagementDbContext(DbContextOptions<ManagementDbContext> options) : base(options)
        {
        }

        public DbSet<Staff> Staff { get; set; }
        public DbSet<Inventory> Inventory { get; set; }
        public DbSet<Department> Departments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Staff>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
                entity.Property(e => e.EmployeeName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.EmployeeAddress).IsRequired().HasMaxLength(500);
                entity.Property(e => e.NIC).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Salary).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Age).IsRequired();
                entity.Property(e => e.Occupation).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Code).IsUnique();
            });

            modelBuilder.Entity<Inventory>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ItemName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Quantity).IsRequired();
            });

            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            });
        }
    }
}

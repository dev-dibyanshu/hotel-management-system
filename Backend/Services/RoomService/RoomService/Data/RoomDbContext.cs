using RoomService.Models;
using Microsoft.EntityFrameworkCore;

namespace RoomService.Data
{
    public class RoomDbContext : DbContext
    {
        public RoomDbContext(DbContextOptions<RoomDbContext> options) : base(options)
        {
        }

        public DbSet<Room> Rooms { get; set; }
        public DbSet<RoomType> RoomTypes { get; set; }
        public DbSet<Rate> Rates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RoomType>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TypeName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.BaseRate).HasColumnType("decimal(18,2)");
            });

            modelBuilder.Entity<Room>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RoomNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.IsAvailable).IsRequired();
                entity.HasIndex(e => e.RoomNumber).IsUnique();
                
                entity.HasOne(e => e.RoomType)
                    .WithMany(rt => rt.Rooms)
                    .HasForeignKey(e => e.RoomTypeId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Rate>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.CheckIn).IsRequired();
                entity.Property(e => e.CheckOut).IsRequired();
                entity.Property(e => e.Day).IsRequired().HasMaxLength(20);
                entity.Property(e => e.NumberOfGuests).IsRequired();
                entity.Property(e => e.FirstNightPrice).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ExtensionPrice).HasColumnType("decimal(18,2)");
            });
        }
    }
}

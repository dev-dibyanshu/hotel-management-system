using ReservationService.Models;
using Microsoft.EntityFrameworkCore;

namespace ReservationService.Data
{
    public class ReservationDbContext : DbContext
    {
        public ReservationDbContext(DbContextOptions<ReservationDbContext> options) : base(options)
        {
        }

        public DbSet<Reservation> Reservations { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Code).IsRequired().HasMaxLength(50);
                entity.Property(e => e.GuestId).IsRequired();
                entity.Property(e => e.RoomId).IsRequired();
                entity.Property(e => e.NumberOfChildren).IsRequired();
                entity.Property(e => e.NumberOfAdults).IsRequired();
                entity.Property(e => e.CheckInDate).IsRequired();
                entity.Property(e => e.CheckOutDate).IsRequired();
                entity.Property(e => e.Status).IsRequired().HasMaxLength(50);
                entity.Property(e => e.NumberOfNights).IsRequired();
                entity.HasIndex(e => e.Code).IsUnique();
            });
        }
    }
}

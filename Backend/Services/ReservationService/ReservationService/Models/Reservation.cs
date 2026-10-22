namespace ReservationService.Models
{
    public class Reservation
    {
        public int Id { get; set; }
        public required string Code { get; set; }
        public int GuestId { get; set; }
        public int RoomId { get; set; }
        public int NumberOfChildren { get; set; }
        public int NumberOfAdults { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public required string Status { get; set; }
        public int NumberOfNights { get; set; }
    }
}

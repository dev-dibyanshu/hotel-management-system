namespace ReservationService.DTOs
{
    public class ReservationDto
    {
        public int Id { get; set; }
        public required string Code { get; set; }
        public int GuestId { get; set; }
        public string? GuestName { get; set; }
        public int RoomId { get; set; }
        public string? RoomNumber { get; set; }
        public int NumberOfChildren { get; set; }
        public int NumberOfAdults { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public required string Status { get; set; }
        public int NumberOfNights { get; set; }
    }

    public class CreateReservationDto
    {
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

    public class UpdateReservationDto
    {
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

    public class GuestInfo
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }

    public class RoomInfo
    {
        public int Id { get; set; }
        public string? RoomNumber { get; set; }
    }
}

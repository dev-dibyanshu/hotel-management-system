namespace RoomService.DTOs
{
    public class RoomDto
    {
        public int Id { get; set; }
        public required string RoomNumber { get; set; }
        public int RoomTypeId { get; set; }
        public string? RoomTypeName { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class CreateRoomDto
    {
        public required string RoomNumber { get; set; }
        public int RoomTypeId { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class UpdateRoomDto
    {
        public required string RoomNumber { get; set; }
        public int RoomTypeId { get; set; }
        public bool IsAvailable { get; set; }
    }

    public class RoomTypeDto
    {
        public int Id { get; set; }
        public required string TypeName { get; set; }
        public decimal BaseRate { get; set; }
    }

    public class CreateRoomTypeDto
    {
        public required string TypeName { get; set; }
        public decimal BaseRate { get; set; }
    }

    public class UpdateRoomTypeDto
    {
        public required string TypeName { get; set; }
        public decimal BaseRate { get; set; }
    }

    public class RateDto
    {
        public int Id { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public required string Day { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal FirstNightPrice { get; set; }
        public decimal ExtensionPrice { get; set; }
    }

    public class CreateRateDto
    {
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public required string Day { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal FirstNightPrice { get; set; }
        public decimal ExtensionPrice { get; set; }
    }

    public class UpdateRateDto
    {
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public required string Day { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal FirstNightPrice { get; set; }
        public decimal ExtensionPrice { get; set; }
    }
}

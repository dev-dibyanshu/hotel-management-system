namespace RoomService.Models
{
    public class Rate
    {
        public int Id { get; set; }
        public DateTime CheckIn { get; set; }
        public DateTime CheckOut { get; set; }
        public required string Day { get; set; }
        public int NumberOfGuests { get; set; }
        public decimal FirstNightPrice { get; set; }
        public decimal ExtensionPrice { get; set; }
    }
}

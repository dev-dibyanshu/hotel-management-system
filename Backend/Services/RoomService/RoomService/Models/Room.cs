namespace RoomService.Models
{
    public class Room
    {
        public int Id { get; set; }
        public required string RoomNumber { get; set; }
        public int RoomTypeId { get; set; }
        public bool IsAvailable { get; set; }
        
        public RoomType? RoomType { get; set; }
    }
}

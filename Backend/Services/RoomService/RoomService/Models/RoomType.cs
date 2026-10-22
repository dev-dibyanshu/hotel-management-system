namespace RoomService.Models
{
    public class RoomType
    {
        public int Id { get; set; }
        public required string TypeName { get; set; }
        public decimal BaseRate { get; set; }
        
        public ICollection<Room> Rooms { get; set; } = new List<Room>();
    }
}

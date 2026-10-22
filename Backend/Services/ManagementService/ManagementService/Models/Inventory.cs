namespace ManagementService.Models
{
    public class Inventory
    {
        public int Id { get; set; }
        public required string ItemName { get; set; }
        public int Quantity { get; set; }
    }
}

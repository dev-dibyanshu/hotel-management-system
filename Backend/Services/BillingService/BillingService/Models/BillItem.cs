namespace BillingService.Models
{
    public class BillItem
    {
        public int Id { get; set; }
        public int BillId { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Taxes { get; set; }
        public required string Services { get; set; }
        public required string Unit { get; set; }
        
        public Bill? Bill { get; set; }
    }
}

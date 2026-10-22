namespace BillingService.Models
{
    public class Bill
    {
        public int Id { get; set; }
        public required string BillingNumber { get; set; }
        public DateTime Date { get; set; }
        
        public ICollection<BillItem> BillItems { get; set; } = new List<BillItem>();
    }
}

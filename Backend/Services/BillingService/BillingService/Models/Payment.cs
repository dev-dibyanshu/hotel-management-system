namespace BillingService.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public decimal Total { get; set; }
        public DateTime PaymentTime { get; set; }
        public required string CreditCardDetails { get; set; }
    }
}

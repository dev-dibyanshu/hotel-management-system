namespace BillingService.DTOs
{
    public class PaymentDto
    {
        public int Id { get; set; }
        public decimal Total { get; set; }
        public DateTime PaymentTime { get; set; }
        public required string CreditCardDetails { get; set; }
    }

    public class CreatePaymentDto
    {
        public decimal Total { get; set; }
        public DateTime PaymentTime { get; set; }
        public required string CreditCardDetails { get; set; }
    }

    public class BillDto
    {
        public int Id { get; set; }
        public required string BillingNumber { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public List<BillItemDto> Items { get; set; } = new List<BillItemDto>();
    }

    public class CreateBillDto
    {
        public required string BillingNumber { get; set; }
        public DateTime Date { get; set; }
        public List<CreateBillItemDto> Items { get; set; } = new List<CreateBillItemDto>();
    }

    public class BillItemDto
    {
        public int Id { get; set; }
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Taxes { get; set; }
        public required string Services { get; set; }
        public required string Unit { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class CreateBillItemDto
    {
        public decimal Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Taxes { get; set; }
        public required string Services { get; set; }
        public required string Unit { get; set; }
    }
}

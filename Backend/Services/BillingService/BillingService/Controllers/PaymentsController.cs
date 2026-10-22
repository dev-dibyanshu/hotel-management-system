using BillingService.Data;
using BillingService.DTOs;
using BillingService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BillingService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner,Manager")]
    public class PaymentsController : ControllerBase
    {
        private readonly BillingDbContext _context;

        public PaymentsController(BillingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDto>>> GetPayments()
        {
            var payments = await _context.Payments
                .Select(p => new PaymentDto
                {
                    Id = p.Id,
                    Total = p.Total,
                    PaymentTime = p.PaymentTime,
                    CreditCardDetails = p.CreditCardDetails
                })
                .ToListAsync();

            return Ok(payments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDto>> GetPayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);

            if (payment == null)
            {
                return NotFound();
            }

            var paymentDto = new PaymentDto
            {
                Id = payment.Id,
                Total = payment.Total,
                PaymentTime = payment.PaymentTime,
                CreditCardDetails = payment.CreditCardDetails
            };

            return Ok(paymentDto);
        }

        [HttpPost]
        public async Task<ActionResult<PaymentDto>> CreatePayment([FromBody] CreatePaymentDto createPaymentDto)
        {
            var payment = new Payment
            {
                Total = createPaymentDto.Total,
                PaymentTime = createPaymentDto.PaymentTime,
                CreditCardDetails = createPaymentDto.CreditCardDetails
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            var paymentDto = new PaymentDto
            {
                Id = payment.Id,
                Total = payment.Total,
                PaymentTime = payment.PaymentTime,
                CreditCardDetails = payment.CreditCardDetails
            };

            return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, paymentDto);
        }
    }
}

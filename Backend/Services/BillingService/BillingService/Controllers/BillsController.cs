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
    [Authorize(Roles = "Owner,Manager,Receptionist")]
    public class BillsController : ControllerBase
    {
        private readonly BillingDbContext _context;

        public BillsController(BillingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<BillDto>>> GetBills()
        {
            var bills = await _context.Bills
                .Include(b => b.BillItems)
                .ToListAsync();

            var billDtos = bills.Select(b => new BillDto
            {
                Id = b.Id,
                BillingNumber = b.BillingNumber,
                Date = b.Date,
                Items = b.BillItems.Select(item => new BillItemDto
                {
                    Id = item.Id,
                    Quantity = item.Quantity,
                    Price = item.Price,
                    Taxes = item.Taxes,
                    Services = item.Services,
                    Unit = item.Unit,
                    Subtotal = (item.Quantity * item.Price) + item.Taxes
                }).ToList(),
                TotalAmount = b.BillItems.Sum(item => (item.Quantity * item.Price) + item.Taxes)
            }).ToList();

            return Ok(billDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BillDto>> GetBill(int id)
        {
            var bill = await _context.Bills
                .Include(b => b.BillItems)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (bill == null)
            {
                return NotFound();
            }

            var billDto = new BillDto
            {
                Id = bill.Id,
                BillingNumber = bill.BillingNumber,
                Date = bill.Date,
                Items = bill.BillItems.Select(item => new BillItemDto
                {
                    Id = item.Id,
                    Quantity = item.Quantity,
                    Price = item.Price,
                    Taxes = item.Taxes,
                    Services = item.Services,
                    Unit = item.Unit,
                    Subtotal = (item.Quantity * item.Price) + item.Taxes
                }).ToList(),
                TotalAmount = bill.BillItems.Sum(item => (item.Quantity * item.Price) + item.Taxes)
            };

            return Ok(billDto);
        }

        [HttpPost]
        public async Task<ActionResult<BillDto>> CreateBill([FromBody] CreateBillDto createBillDto)
        {
            var existingBill = await _context.Bills
                .FirstOrDefaultAsync(b => b.BillingNumber == createBillDto.BillingNumber);

            if (existingBill != null)
            {
                return Conflict(new { message = "Billing number already exists" });
            }

            var bill = new Bill
            {
                BillingNumber = createBillDto.BillingNumber,
                Date = createBillDto.Date
            };

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();

            foreach (var itemDto in createBillDto.Items)
            {
                var billItem = new BillItem
                {
                    BillId = bill.Id,
                    Quantity = itemDto.Quantity,
                    Price = itemDto.Price,
                    Taxes = itemDto.Taxes,
                    Services = itemDto.Services,
                    Unit = itemDto.Unit
                };
                _context.BillItems.Add(billItem);
            }

            await _context.SaveChangesAsync();

            var createdBill = await _context.Bills
                .Include(b => b.BillItems)
                .FirstOrDefaultAsync(b => b.Id == bill.Id);

            var billDto = new BillDto
            {
                Id = createdBill!.Id,
                BillingNumber = createdBill.BillingNumber,
                Date = createdBill.Date,
                Items = createdBill.BillItems.Select(item => new BillItemDto
                {
                    Id = item.Id,
                    Quantity = item.Quantity,
                    Price = item.Price,
                    Taxes = item.Taxes,
                    Services = item.Services,
                    Unit = item.Unit,
                    Subtotal = (item.Quantity * item.Price) + item.Taxes
                }).ToList(),
                TotalAmount = createdBill.BillItems.Sum(item => (item.Quantity * item.Price) + item.Taxes)
            };

            return CreatedAtAction(nameof(GetBill), new { id = bill.Id }, billDto);
        }
    }
}

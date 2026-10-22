using RoomService.Data;
using RoomService.DTOs;
using RoomService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace RoomService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner,Manager")]
    public class RatesController : ControllerBase
    {
        private readonly RoomDbContext _context;

        public RatesController(RoomDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RateDto>>> GetRates()
        {
            var rates = await _context.Rates
                .Select(r => new RateDto
                {
                    Id = r.Id,
                    CheckIn = r.CheckIn,
                    CheckOut = r.CheckOut,
                    Day = r.Day,
                    NumberOfGuests = r.NumberOfGuests,
                    FirstNightPrice = r.FirstNightPrice,
                    ExtensionPrice = r.ExtensionPrice
                })
                .ToListAsync();

            return Ok(rates);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RateDto>> GetRate(int id)
        {
            var rate = await _context.Rates.FindAsync(id);

            if (rate == null)
            {
                return NotFound();
            }

            var rateDto = new RateDto
            {
                Id = rate.Id,
                CheckIn = rate.CheckIn,
                CheckOut = rate.CheckOut,
                Day = rate.Day,
                NumberOfGuests = rate.NumberOfGuests,
                FirstNightPrice = rate.FirstNightPrice,
                ExtensionPrice = rate.ExtensionPrice
            };

            return Ok(rateDto);
        }

        [HttpPost]
        public async Task<ActionResult<RateDto>> CreateRate([FromBody] CreateRateDto createRateDto)
        {
            var rate = new Rate
            {
                CheckIn = createRateDto.CheckIn,
                CheckOut = createRateDto.CheckOut,
                Day = createRateDto.Day,
                NumberOfGuests = createRateDto.NumberOfGuests,
                FirstNightPrice = createRateDto.FirstNightPrice,
                ExtensionPrice = createRateDto.ExtensionPrice
            };

            _context.Rates.Add(rate);
            await _context.SaveChangesAsync();

            var rateDto = new RateDto
            {
                Id = rate.Id,
                CheckIn = rate.CheckIn,
                CheckOut = rate.CheckOut,
                Day = rate.Day,
                NumberOfGuests = rate.NumberOfGuests,
                FirstNightPrice = rate.FirstNightPrice,
                ExtensionPrice = rate.ExtensionPrice
            };

            return CreatedAtAction(nameof(GetRate), new { id = rate.Id }, rateDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRate(int id, [FromBody] UpdateRateDto updateRateDto)
        {
            var rate = await _context.Rates.FindAsync(id);
            if (rate == null)
            {
                return NotFound();
            }

            rate.CheckIn = updateRateDto.CheckIn;
            rate.CheckOut = updateRateDto.CheckOut;
            rate.Day = updateRateDto.Day;
            rate.NumberOfGuests = updateRateDto.NumberOfGuests;
            rate.FirstNightPrice = updateRateDto.FirstNightPrice;
            rate.ExtensionPrice = updateRateDto.ExtensionPrice;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRate(int id)
        {
            var rate = await _context.Rates.FindAsync(id);
            if (rate == null)
            {
                return NotFound();
            }

            _context.Rates.Remove(rate);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

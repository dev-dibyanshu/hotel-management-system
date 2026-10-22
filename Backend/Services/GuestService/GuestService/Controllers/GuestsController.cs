using GuestService.Data;
using GuestService.DTOs;
using GuestService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GuestService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GuestsController : ControllerBase
    {
        private readonly GuestDbContext _context;

        public GuestsController(GuestDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Owner,Manager,Receptionist")]
        public async Task<ActionResult<IEnumerable<GuestDto>>> GetGuests()
        {
            var guests = await _context.Guests
                .Select(g => new GuestDto
                {
                    Id = g.Id,
                    MemberCode = g.MemberCode,
                    PhoneNumber = g.PhoneNumber,
                    Company = g.Company,
                    Name = g.Name,
                    Email = g.Email,
                    Gender = g.Gender,
                    Address = g.Address
                })
                .ToListAsync();

            return Ok(guests);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Owner,Manager,Receptionist")]
        public async Task<ActionResult<GuestDto>> GetGuest(int id)
        {
            var guest = await _context.Guests.FindAsync(id);

            if (guest == null)
            {
                return NotFound();
            }

            var guestDto = new GuestDto
            {
                Id = guest.Id,
                MemberCode = guest.MemberCode,
                PhoneNumber = guest.PhoneNumber,
                Company = guest.Company,
                Name = guest.Name,
                Email = guest.Email,
                Gender = guest.Gender,
                Address = guest.Address
            };

            return Ok(guestDto);
        }

        [HttpPost]
        [Authorize(Roles = "Owner,Manager,Receptionist")]
        public async Task<ActionResult<GuestDto>> CreateGuest([FromBody] CreateGuestDto createGuestDto)
        {
            var existingGuest = await _context.Guests
                .FirstOrDefaultAsync(g => g.MemberCode == createGuestDto.MemberCode);

            if (existingGuest != null)
            {
                return Conflict(new { message = "Member code already exists" });
            }

            var guest = new Guest
            {
                MemberCode = createGuestDto.MemberCode,
                PhoneNumber = createGuestDto.PhoneNumber,
                Company = createGuestDto.Company,
                Name = createGuestDto.Name,
                Email = createGuestDto.Email,
                Gender = createGuestDto.Gender,
                Address = createGuestDto.Address
            };

            _context.Guests.Add(guest);
            await _context.SaveChangesAsync();

            var guestDto = new GuestDto
            {
                Id = guest.Id,
                MemberCode = guest.MemberCode,
                PhoneNumber = guest.PhoneNumber,
                Company = guest.Company,
                Name = guest.Name,
                Email = guest.Email,
                Gender = guest.Gender,
                Address = guest.Address
            };

            return CreatedAtAction(nameof(GetGuest), new { id = guest.Id }, guestDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Owner,Manager,Receptionist")]
        public async Task<IActionResult> UpdateGuest(int id, [FromBody] UpdateGuestDto updateGuestDto)
        {
            var guest = await _context.Guests.FindAsync(id);
            if (guest == null)
            {
                return NotFound();
            }

            guest.MemberCode = updateGuestDto.MemberCode;
            guest.PhoneNumber = updateGuestDto.PhoneNumber;
            guest.Company = updateGuestDto.Company;
            guest.Name = updateGuestDto.Name;
            guest.Email = updateGuestDto.Email;
            guest.Gender = updateGuestDto.Gender;
            guest.Address = updateGuestDto.Address;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Owner,Manager,Receptionist")]
        public async Task<IActionResult> DeleteGuest(int id)
        {
            var guest = await _context.Guests.FindAsync(id);
            if (guest == null)
            {
                return NotFound();
            }

            _context.Guests.Remove(guest);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

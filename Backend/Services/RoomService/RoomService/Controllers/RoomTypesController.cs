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
    public class RoomTypesController : ControllerBase
    {
        private readonly RoomDbContext _context;

        public RoomTypesController(RoomDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomTypeDto>>> GetRoomTypes()
        {
            var roomTypes = await _context.RoomTypes
                .Select(rt => new RoomTypeDto
                {
                    Id = rt.Id,
                    TypeName = rt.TypeName,
                    BaseRate = rt.BaseRate
                })
                .ToListAsync();

            return Ok(roomTypes);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RoomTypeDto>> GetRoomType(int id)
        {
            var roomType = await _context.RoomTypes.FindAsync(id);

            if (roomType == null)
            {
                return NotFound();
            }

            var roomTypeDto = new RoomTypeDto
            {
                Id = roomType.Id,
                TypeName = roomType.TypeName,
                BaseRate = roomType.BaseRate
            };

            return Ok(roomTypeDto);
        }

        [HttpPost]
        public async Task<ActionResult<RoomTypeDto>> CreateRoomType([FromBody] CreateRoomTypeDto createRoomTypeDto)
        {
            var roomType = new RoomType
            {
                TypeName = createRoomTypeDto.TypeName,
                BaseRate = createRoomTypeDto.BaseRate
            };

            _context.RoomTypes.Add(roomType);
            await _context.SaveChangesAsync();

            var roomTypeDto = new RoomTypeDto
            {
                Id = roomType.Id,
                TypeName = roomType.TypeName,
                BaseRate = roomType.BaseRate
            };

            return CreatedAtAction(nameof(GetRoomType), new { id = roomType.Id }, roomTypeDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoomType(int id, [FromBody] UpdateRoomTypeDto updateRoomTypeDto)
        {
            var roomType = await _context.RoomTypes.FindAsync(id);
            if (roomType == null)
            {
                return NotFound();
            }

            roomType.TypeName = updateRoomTypeDto.TypeName;
            roomType.BaseRate = updateRoomTypeDto.BaseRate;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoomType(int id)
        {
            var roomType = await _context.RoomTypes.FindAsync(id);
            if (roomType == null)
            {
                return NotFound();
            }

            _context.RoomTypes.Remove(roomType);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

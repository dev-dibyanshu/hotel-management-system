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
    [Authorize]
    public class RoomsController : ControllerBase
    {
        private readonly RoomDbContext _context;

        public RoomsController(RoomDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Owner,Manager,Receptionist")]
        public async Task<ActionResult<IEnumerable<RoomDto>>> GetRooms()
        {
            var rooms = await _context.Rooms
                .Include(r => r.RoomType)
                .Select(r => new RoomDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    RoomTypeId = r.RoomTypeId,
                    RoomTypeName = r.RoomType!.TypeName,
                    IsAvailable = r.IsAvailable
                })
                .ToListAsync();

            return Ok(rooms);
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "Owner,Manager,Receptionist")]
        public async Task<ActionResult<RoomDto>> GetRoom(int id)
        {
            var room = await _context.Rooms
                .Include(r => r.RoomType)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (room == null)
            {
                return NotFound();
            }

            var roomDto = new RoomDto
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                RoomTypeId = room.RoomTypeId,
                RoomTypeName = room.RoomType?.TypeName,
                IsAvailable = room.IsAvailable
            };

            return Ok(roomDto);
        }

        [HttpGet("availability")]
        [Authorize(Roles = "Owner,Manager,Receptionist")]
        public async Task<ActionResult<IEnumerable<RoomDto>>> CheckAvailability([FromQuery] DateTime? checkIn, [FromQuery] DateTime? checkOut)
        {
            var availableRooms = await _context.Rooms
                .Include(r => r.RoomType)
                .Where(r => r.IsAvailable)
                .Select(r => new RoomDto
                {
                    Id = r.Id,
                    RoomNumber = r.RoomNumber,
                    RoomTypeId = r.RoomTypeId,
                    RoomTypeName = r.RoomType!.TypeName,
                    IsAvailable = r.IsAvailable
                })
                .ToListAsync();

            return Ok(availableRooms);
        }

        [HttpPost]
        [Authorize(Roles = "Owner,Manager")]
        public async Task<ActionResult<RoomDto>> CreateRoom([FromBody] CreateRoomDto createRoomDto)
        {
            var existingRoom = await _context.Rooms
                .FirstOrDefaultAsync(r => r.RoomNumber == createRoomDto.RoomNumber);

            if (existingRoom != null)
            {
                return Conflict(new { message = "Room number already exists" });
            }

            var room = new Room
            {
                RoomNumber = createRoomDto.RoomNumber,
                RoomTypeId = createRoomDto.RoomTypeId,
                IsAvailable = createRoomDto.IsAvailable
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            var roomDto = new RoomDto
            {
                Id = room.Id,
                RoomNumber = room.RoomNumber,
                RoomTypeId = room.RoomTypeId,
                IsAvailable = room.IsAvailable
            };

            return CreatedAtAction(nameof(GetRoom), new { id = room.Id }, roomDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Owner,Manager")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] UpdateRoomDto updateRoomDto)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            room.RoomNumber = updateRoomDto.RoomNumber;
            room.RoomTypeId = updateRoomDto.RoomTypeId;
            room.IsAvailable = updateRoomDto.IsAvailable;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Owner,Manager")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

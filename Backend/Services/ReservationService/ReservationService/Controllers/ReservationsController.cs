using ReservationService.Data;
using ReservationService.DTOs;
using ReservationService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace ReservationService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner,Manager,Receptionist")]
    public class ReservationsController : ControllerBase
    {
        private readonly ReservationDbContext _context;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public ReservationsController(ReservationDbContext context, IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReservationDto>>> GetReservations()
        {
            var reservations = await _context.Reservations.ToListAsync();
            var reservationDtos = new List<ReservationDto>();

            foreach (var reservation in reservations)
            {
                var guestInfo = await GetGuestInfo(reservation.GuestId);
                var roomInfo = await GetRoomInfo(reservation.RoomId);

                reservationDtos.Add(new ReservationDto
                {
                    Id = reservation.Id,
                    Code = reservation.Code,
                    GuestId = reservation.GuestId,
                    GuestName = guestInfo?.Name,
                    RoomId = reservation.RoomId,
                    RoomNumber = roomInfo?.RoomNumber,
                    NumberOfChildren = reservation.NumberOfChildren,
                    NumberOfAdults = reservation.NumberOfAdults,
                    CheckInDate = reservation.CheckInDate,
                    CheckOutDate = reservation.CheckOutDate,
                    Status = reservation.Status,
                    NumberOfNights = reservation.NumberOfNights
                });
            }

            return Ok(reservationDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReservationDto>> GetReservation(int id)
        {
            var reservation = await _context.Reservations.FindAsync(id);

            if (reservation == null)
            {
                return NotFound();
            }

            var guestInfo = await GetGuestInfo(reservation.GuestId);
            var roomInfo = await GetRoomInfo(reservation.RoomId);

            var reservationDto = new ReservationDto
            {
                Id = reservation.Id,
                Code = reservation.Code,
                GuestId = reservation.GuestId,
                GuestName = guestInfo?.Name,
                RoomId = reservation.RoomId,
                RoomNumber = roomInfo?.RoomNumber,
                NumberOfChildren = reservation.NumberOfChildren,
                NumberOfAdults = reservation.NumberOfAdults,
                CheckInDate = reservation.CheckInDate,
                CheckOutDate = reservation.CheckOutDate,
                Status = reservation.Status,
                NumberOfNights = reservation.NumberOfNights
            };

            return Ok(reservationDto);
        }

        [HttpPost]
        public async Task<ActionResult<ReservationDto>> CreateReservation([FromBody] CreateReservationDto createReservationDto)
        {
            var existingReservation = await _context.Reservations
                .FirstOrDefaultAsync(r => r.Code == createReservationDto.Code);

            if (existingReservation != null)
            {
                return Conflict(new { message = "Reservation code already exists" });
            }

            var reservation = new Reservation
            {
                Code = createReservationDto.Code,
                GuestId = createReservationDto.GuestId,
                RoomId = createReservationDto.RoomId,
                NumberOfChildren = createReservationDto.NumberOfChildren,
                NumberOfAdults = createReservationDto.NumberOfAdults,
                CheckInDate = createReservationDto.CheckInDate,
                CheckOutDate = createReservationDto.CheckOutDate,
                Status = createReservationDto.Status,
                NumberOfNights = createReservationDto.NumberOfNights
            };

            _context.Reservations.Add(reservation);
            await _context.SaveChangesAsync();

            var reservationDto = new ReservationDto
            {
                Id = reservation.Id,
                Code = reservation.Code,
                GuestId = reservation.GuestId,
                RoomId = reservation.RoomId,
                NumberOfChildren = reservation.NumberOfChildren,
                NumberOfAdults = reservation.NumberOfAdults,
                CheckInDate = reservation.CheckInDate,
                CheckOutDate = reservation.CheckOutDate,
                Status = reservation.Status,
                NumberOfNights = reservation.NumberOfNights
            };

            return CreatedAtAction(nameof(GetReservation), new { id = reservation.Id }, reservationDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateReservation(int id, [FromBody] UpdateReservationDto updateReservationDto)
        {
            var reservation = await _context.Reservations.FindAsync(id);
            if (reservation == null)
            {
                return NotFound();
            }

            reservation.Code = updateReservationDto.Code;
            reservation.GuestId = updateReservationDto.GuestId;
            reservation.RoomId = updateReservationDto.RoomId;
            reservation.NumberOfChildren = updateReservationDto.NumberOfChildren;
            reservation.NumberOfAdults = updateReservationDto.NumberOfAdults;
            reservation.CheckInDate = updateReservationDto.CheckInDate;
            reservation.CheckOutDate = updateReservationDto.CheckOutDate;
            reservation.Status = updateReservationDto.Status;
            reservation.NumberOfNights = updateReservationDto.NumberOfNights;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        private async Task<GuestInfo?> GetGuestInfo(int guestId)
        {
            try
            {
                var guestServiceUrl = _configuration["Services:GuestService"];
                var response = await _httpClient.GetAsync($"{guestServiceUrl}/api/guests/{guestId}");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var guestData = JsonSerializer.Deserialize<GuestInfo>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    return guestData;
                }
            }
            catch
            {
                // Log error - service unavailable
            }
            
            return null;
        }

        private async Task<RoomInfo?> GetRoomInfo(int roomId)
        {
            try
            {
                var roomServiceUrl = _configuration["Services:RoomService"];
                var response = await _httpClient.GetAsync($"{roomServiceUrl}/api/rooms/{roomId}");
                
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var roomData = JsonSerializer.Deserialize<RoomInfo>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    return roomData;
                }
            }
            catch
            {
                // Log error - service unavailable
            }
            
            return null;
        }
    }
}

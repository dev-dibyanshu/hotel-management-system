using AuthService.Data;
using AuthService.DTOs;
using AuthService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AuthDbContext _context;

        public UsersController(AuthDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "Owner,Manager")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Role = u.Role,
                    Email = u.Email
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost]
        [Authorize(Roles = "Owner,Manager")]
        public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Username == createUserDto.Username);

            if (existingUser != null)
            {
                return Conflict(new { message = "Username already exists" });
            }

            var user = new User
            {
                Username = createUserDto.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(createUserDto.Password),
                Role = createUserDto.Role,
                Email = createUserDto.Email
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var userDto = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Role = user.Role,
                Email = user.Email
            };

            return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, userDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Owner,Manager")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto updateUserDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            user.Username = updateUserDto.Username;
            user.Role = updateUserDto.Role;
            user.Email = updateUserDto.Email;

            if (!string.IsNullOrEmpty(updateUserDto.Password))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updateUserDto.Password);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Owner,Manager")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

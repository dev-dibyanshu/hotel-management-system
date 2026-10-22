using ManagementService.Data;
using ManagementService.DTOs;
using ManagementService.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ManagementService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Owner,Manager")]
    public class StaffController : ControllerBase
    {
        private readonly ManagementDbContext _context;

        public StaffController(ManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetStaff()
        {
            var staff = await _context.Staff
                .Select(s => new StaffDto
                {
                    Id = s.Id,
                    Code = s.Code,
                    EmployeeName = s.EmployeeName,
                    EmployeeAddress = s.EmployeeAddress,
                    NIC = s.NIC,
                    Salary = s.Salary,
                    Age = s.Age,
                    Occupation = s.Occupation,
                    Email = s.Email
                })
                .ToListAsync();

            return Ok(staff);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDto>> GetStaffMember(int id)
        {
            var staffMember = await _context.Staff.FindAsync(id);

            if (staffMember == null)
            {
                return NotFound();
            }

            var staffDto = new StaffDto
            {
                Id = staffMember.Id,
                Code = staffMember.Code,
                EmployeeName = staffMember.EmployeeName,
                EmployeeAddress = staffMember.EmployeeAddress,
                NIC = staffMember.NIC,
                Salary = staffMember.Salary,
                Age = staffMember.Age,
                Occupation = staffMember.Occupation,
                Email = staffMember.Email
            };

            return Ok(staffDto);
        }

        [HttpPost]
        public async Task<ActionResult<StaffDto>> CreateStaff([FromBody] CreateStaffDto createStaffDto)
        {
            var existingStaff = await _context.Staff
                .FirstOrDefaultAsync(s => s.Code == createStaffDto.Code);

            if (existingStaff != null)
            {
                return Conflict(new { message = "Staff code already exists" });
            }

            var staff = new Staff
            {
                Code = createStaffDto.Code,
                EmployeeName = createStaffDto.EmployeeName,
                EmployeeAddress = createStaffDto.EmployeeAddress,
                NIC = createStaffDto.NIC,
                Salary = createStaffDto.Salary,
                Age = createStaffDto.Age,
                Occupation = createStaffDto.Occupation,
                Email = createStaffDto.Email
            };

            _context.Staff.Add(staff);
            await _context.SaveChangesAsync();

            var staffDto = new StaffDto
            {
                Id = staff.Id,
                Code = staff.Code,
                EmployeeName = staff.EmployeeName,
                EmployeeAddress = staff.EmployeeAddress,
                NIC = staff.NIC,
                Salary = staff.Salary,
                Age = staff.Age,
                Occupation = staff.Occupation,
                Email = staff.Email
            };

            return CreatedAtAction(nameof(GetStaffMember), new { id = staff.Id }, staffDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStaff(int id, [FromBody] UpdateStaffDto updateStaffDto)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }

            staff.Code = updateStaffDto.Code;
            staff.EmployeeName = updateStaffDto.EmployeeName;
            staff.EmployeeAddress = updateStaffDto.EmployeeAddress;
            staff.NIC = updateStaffDto.NIC;
            staff.Salary = updateStaffDto.Salary;
            staff.Age = updateStaffDto.Age;
            staff.Occupation = updateStaffDto.Occupation;
            staff.Email = updateStaffDto.Email;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var staff = await _context.Staff.FindAsync(id);
            if (staff == null)
            {
                return NotFound();
            }

            _context.Staff.Remove(staff);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

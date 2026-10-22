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
    [Authorize(Roles = "Owner")]
    public class DepartmentsController : ControllerBase
    {
        private readonly ManagementDbContext _context;

        public DepartmentsController(ManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDto>>> GetDepartments()
        {
            var departments = await _context.Departments
                .Select(d => new DepartmentDto
                {
                    Id = d.Id,
                    Name = d.Name
                })
                .ToListAsync();

            return Ok(departments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<DepartmentDto>> GetDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            var departmentDto = new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name
            };

            return Ok(departmentDto);
        }

        [HttpPost]
        public async Task<ActionResult<DepartmentDto>> CreateDepartment([FromBody] CreateDepartmentDto createDepartmentDto)
        {
            var department = new Department
            {
                Name = createDepartmentDto.Name
            };

            _context.Departments.Add(department);
            await _context.SaveChangesAsync();

            var departmentDto = new DepartmentDto
            {
                Id = department.Id,
                Name = department.Name
            };

            return CreatedAtAction(nameof(GetDepartment), new { id = department.Id }, departmentDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] UpdateDepartmentDto updateDepartmentDto)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
            {
                return NotFound();
            }

            department.Name = updateDepartmentDto.Name;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
            {
                return NotFound();
            }

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

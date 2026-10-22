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
    public class InventoryController : ControllerBase
    {
        private readonly ManagementDbContext _context;

        public InventoryController(ManagementDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<InventoryDto>>> GetInventory()
        {
            var inventory = await _context.Inventory
                .Select(i => new InventoryDto
                {
                    Id = i.Id,
                    ItemName = i.ItemName,
                    Quantity = i.Quantity
                })
                .ToListAsync();

            return Ok(inventory);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<InventoryDto>> GetInventoryItem(int id)
        {
            var item = await _context.Inventory.FindAsync(id);

            if (item == null)
            {
                return NotFound();
            }

            var inventoryDto = new InventoryDto
            {
                Id = item.Id,
                ItemName = item.ItemName,
                Quantity = item.Quantity
            };

            return Ok(inventoryDto);
        }

        [HttpPost]
        public async Task<ActionResult<InventoryDto>> CreateInventory([FromBody] CreateInventoryDto createInventoryDto)
        {
            var inventory = new Inventory
            {
                ItemName = createInventoryDto.ItemName,
                Quantity = createInventoryDto.Quantity
            };

            _context.Inventory.Add(inventory);
            await _context.SaveChangesAsync();

            var inventoryDto = new InventoryDto
            {
                Id = inventory.Id,
                ItemName = inventory.ItemName,
                Quantity = inventory.Quantity
            };

            return CreatedAtAction(nameof(GetInventoryItem), new { id = inventory.Id }, inventoryDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInventory(int id, [FromBody] UpdateInventoryDto updateInventoryDto)
        {
            var inventory = await _context.Inventory.FindAsync(id);
            if (inventory == null)
            {
                return NotFound();
            }

            inventory.ItemName = updateInventoryDto.ItemName;
            inventory.Quantity = updateInventoryDto.Quantity;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInventory(int id)
        {
            var inventory = await _context.Inventory.FindAsync(id);
            if (inventory == null)
            {
                return NotFound();
            }

            _context.Inventory.Remove(inventory);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

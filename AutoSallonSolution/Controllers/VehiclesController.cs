using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoSallonSolution.Models;
using AutoSallonSolution.Data;

namespace AutoSallonSolution.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // Static data for vehicle attributes
        private static readonly string[] Brands = new[]
        {
            "Mercedes-Benz", "BMW", "Audi", "Volkswagen", "Toyota", "Honda", "Ford", "Chevrolet",
            "Nissan", "Hyundai", "Kia", "Mazda", "Subaru", "Lexus", "Porsche", "Ferrari", "Lamborghini",
            "Maserati", "Bentley", "Rolls-Royce"
        };

        private static readonly string[] FuelTypes = new[]
        {
            "Petrol", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "Natural Gas", "Hydrogen"
        };

        private static readonly string[] Transmissions = new[]
        {
            "Automatic", "Manual", "Semi-Automatic", "CVT"
        };

        private static readonly string[] Colors = new[]
        {
            "Black", "White", "Silver", "Gray", "Red", "Blue", "Green", "Yellow", "Orange", "Purple",
            "Brown", "Beige", "Gold", "Bronze", "Navy Blue", "Burgundy", "Teal", "Pink"
        };

        public VehiclesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetVehicles(
            [FromQuery] string searchTerm = "",
            [FromQuery] string brand = "",
            [FromQuery] int? minYear = null,
            [FromQuery] int? maxYear = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] string fuel = "",
            [FromQuery] string transmission = "",
            [FromQuery] string color = "")
        {
            var query = _context.Vehicles.AsQueryable();
            
            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                query = query.Where(v => v.Title.Contains(searchTerm));
            }

            if (!string.IsNullOrWhiteSpace(brand))
            {
                query = query.Where(v => v.Brand == brand);
            }

            if (minYear.HasValue)
            {
                query = query.Where(v => v.Year >= minYear.Value);
            }

            if (maxYear.HasValue)
            {
                query = query.Where(v => v.Year <= maxYear.Value);
            }

            if (minPrice.HasValue)
            {
                query = query.Where(v => v.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                query = query.Where(v => v.Price <= maxPrice.Value);
            }

            if (!string.IsNullOrWhiteSpace(fuel))
            {
                query = query.Where(v => v.Fuel == fuel);
            }

            if (!string.IsNullOrWhiteSpace(transmission))
            {
                query = query.Where(v => v.Transmission == transmission);
            }

            if (!string.IsNullOrWhiteSpace(color))
            {
                query = query.Where(v => v.Color == color);
            }
            
            var vehicles = await query.ToListAsync();
            return Ok(vehicles);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return NotFound();

            return Ok(vehicle);
        }

        [HttpPost]
        public async Task<IActionResult> CreateVehicle(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetVehicle), new { id = vehicle.Id }, vehicle);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, Vehicle vehicle)
        {
            if (id != vehicle.Id)
                return BadRequest();

            _context.Entry(vehicle).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
                return NotFound();

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("brands")]
        public IActionResult GetBrands()
        {
            return Ok(Brands);
        }

        [HttpGet("fueltypes")]
        public IActionResult GetFuelTypes()
        {
            return Ok(FuelTypes);
        }

        [HttpGet("transmissions")]
        public IActionResult GetTransmissions()
        {
            return Ok(Transmissions);
        }

        [HttpGet("colors")]
        public IActionResult GetColors()
        {
            return Ok(Colors);
        }
    }
} 
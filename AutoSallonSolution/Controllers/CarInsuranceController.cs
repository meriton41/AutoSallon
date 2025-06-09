using AutoSallonSolution.Data;
using AutoSallonSolution.Models;
using AutoSallonSolution.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace AutoSallonSolution.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarInsuranceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<CarInsuranceController> _logger;

        public CarInsuranceController(ApplicationDbContext context, ILogger<CarInsuranceController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarInsurance>>> GetAll()
        {
            return await _context.CarInsurances
                .Include(ci => ci.Vehicle)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CarInsurance>> GetById(Guid id)
        {
            var insurance = await _context.CarInsurances
                .Include(ci => ci.Vehicle)
                .FirstOrDefaultAsync(ci => ci.Id == id);

            if (insurance == null)
            {
                return NotFound();
            }

            return insurance;
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<ActionResult<IEnumerable<CarInsurance>>> GetByVehicleId(int vehicleId)
        {
            return await _context.CarInsurances
                .Include(ci => ci.Vehicle)
                .Where(ci => ci.VehicleId == vehicleId)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<CarInsurance>> Create(CreateCarInsuranceDTO dto)
        {
            _logger.LogInformation("Received CarInsurance creation request: {@Dto}", dto);

            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Invalid model state: {@ModelState}", ModelState);
                return BadRequest(ModelState);
            }

            try
            {
                // Check if vehicle exists
                var vehicle = await _context.Vehicles.FindAsync(dto.VehicleId);
                if (vehicle == null)
                {
                    _logger.LogWarning("Vehicle not found with ID: {VehicleId}", dto.VehicleId);
                    return BadRequest($"Invalid VehicleId: {dto.VehicleId}");
                }

                // Check if vehicle already has insurance
                var existing = await _context.CarInsurances
                    .FirstOrDefaultAsync(ci => ci.VehicleId == dto.VehicleId);
                if (existing != null)
                {
                    _logger.LogWarning("Vehicle {VehicleId} already has insurance", dto.VehicleId);
                    return BadRequest("This vehicle already has an insurance assigned.");
                }

                // Validate dates
                if (dto.EndDate <= dto.StartDate)
                {
                    _logger.LogWarning("Invalid dates: StartDate={StartDate}, EndDate={EndDate}", 
                        dto.StartDate, dto.EndDate);
                    return BadRequest("End date must be after start date");
                }

                var insurance = new CarInsurance
                {
                    Id = Guid.NewGuid(),
                    PolicyNumber = dto.PolicyNumber,
                    VehicleId = dto.VehicleId,
                    ClientName = dto.ClientName,
                    ClientEmail = dto.ClientEmail,
                    StartDate = dto.StartDate,
                    EndDate = dto.EndDate,
                    CoverageDetails = dto.CoverageDetails,
                    Price = dto.Price
                };

                _context.CarInsurances.Add(insurance);
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("Successfully created insurance with ID: {InsuranceId}", insurance.Id);
                return CreatedAtAction(nameof(GetById), new { id = insurance.Id }, insurance);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating car insurance");
                return StatusCode(500, "An error occurred while creating the insurance");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, CarInsurance insurance)
        {
            if (id != insurance.Id)
            {
                return BadRequest();
            }

            // Check if vehicle exists
            var vehicle = await _context.Vehicles.FindAsync(insurance.VehicleId);
            if (vehicle == null)
            {
                return BadRequest("Invalid VehicleId");
            }

            var existingInsurance = await _context.CarInsurances.FindAsync(id);
            if (existingInsurance == null)
            {
                return NotFound();
            }

            // Check if another vehicle already has this insurance
            var duplicateInsurance = await _context.CarInsurances
                .FirstOrDefaultAsync(ci => ci.VehicleId == insurance.VehicleId && ci.Id != id);
            if (duplicateInsurance != null)
            {
                return BadRequest("This vehicle already has an insurance assigned.");
            }

            _context.Entry(existingInsurance).CurrentValues.SetValues(insurance);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var insurance = await _context.CarInsurances.FindAsync(id);
            if (insurance == null)
            {
                return NotFound();
            }

            _context.CarInsurances.Remove(insurance);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

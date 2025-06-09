using AutoSallonSolution.Data;
using AutoSallonSolution.Models;
using AutoSallonSolution.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text.Json;

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
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var insurances = await _context.CarInsurances
                .Include(ci => ci.Vehicle)
                .Select(ci => new
                {
                    ci.Id,
                    ci.PolicyNumber,
                    ci.VehicleId,
                    ci.ClientName,
                    ci.ClientEmail,
                    ci.StartDate,
                    ci.EndDate,
                    ci.CoverageDetails,
                    ci.Price,
                    Vehicle = new
                    {
                        ci.Vehicle.Id,
                        ci.Vehicle.Title,
                        ci.Vehicle.Brand,
                        ci.Vehicle.Year,
                        ci.Vehicle.Color
                    }
                })
                .ToListAsync();
            
            return Ok(insurances);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetById(Guid id)
        {
            var insurance = await _context.CarInsurances
                .Include(ci => ci.Vehicle)
                .Select(ci => new
                {
                    ci.Id,
                    ci.PolicyNumber,
                    ci.VehicleId,
                    ci.ClientName,
                    ci.ClientEmail,
                    ci.StartDate,
                    ci.EndDate,
                    ci.CoverageDetails,
                    ci.Price,
                    Vehicle = new
                    {
                        ci.Vehicle.Id,
                        ci.Vehicle.Title,
                        ci.Vehicle.Brand,
                        ci.Vehicle.Year,
                        ci.Vehicle.Color
                    }
                })
                .FirstOrDefaultAsync(ci => ci.Id == id);

            if (insurance == null)
            {
                return NotFound();
            }

            return Ok(insurance);
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetByVehicleId(int vehicleId)
        {
            var insurances = await _context.CarInsurances
                .Include(ci => ci.Vehicle)
                .Where(ci => ci.VehicleId == vehicleId)
                .Select(ci => new
                {
                    ci.Id,
                    ci.PolicyNumber,
                    ci.VehicleId,
                    ci.ClientName,
                    ci.ClientEmail,
                    ci.StartDate,
                    ci.EndDate,
                    ci.CoverageDetails,
                    ci.Price,
                    Vehicle = new
                    {
                        ci.Vehicle.Id,
                        ci.Vehicle.Title,
                        ci.Vehicle.Brand,
                        ci.Vehicle.Year,
                        ci.Vehicle.Color
                    }
                })
                .ToListAsync();
            
            return Ok(insurances);
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
        public async Task<IActionResult> Update(Guid id)
        {
            try
            {
                using var reader = new StreamReader(Request.Body);
                var requestBody = await reader.ReadToEndAsync();
                _logger.LogInformation("Received raw update request for ID {Id}: {Body}", id, requestBody);

                if (string.IsNullOrEmpty(requestBody))
                {
                    return BadRequest("Request body is empty");
                }

                var updateData = System.Text.Json.JsonSerializer.Deserialize<UpdateCarInsuranceDTO>(requestBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                if (updateData == null)
                {
                    return BadRequest("Invalid JSON data");
                }

                _logger.LogInformation("Deserialized update data: {@UpdateData}", updateData);

                // Manual validation
                if (string.IsNullOrEmpty(updateData.PolicyNumber))
                    return BadRequest("PolicyNumber is required");
                if (updateData.VehicleId <= 0)
                    return BadRequest("Valid VehicleId is required");
                if (string.IsNullOrEmpty(updateData.ClientName))
                    return BadRequest("ClientName is required");
                if (string.IsNullOrEmpty(updateData.ClientEmail))
                    return BadRequest("ClientEmail is required");
                if (string.IsNullOrEmpty(updateData.CoverageDetails))
                    return BadRequest("CoverageDetails is required");
                if (updateData.Price <= 0)
                    return BadRequest("Price must be greater than 0");
                var existingInsurance = await _context.CarInsurances.FindAsync(id);
                if (existingInsurance == null)
                {
                    return NotFound();
                }

                // Check if vehicle exists
                var vehicle = await _context.Vehicles.FindAsync(updateData.VehicleId);
                if (vehicle == null)
                {
                    return BadRequest("Invalid VehicleId");
                }

                // Check if another vehicle already has this insurance (exclude current insurance)
                var duplicateInsurance = await _context.CarInsurances
                    .FirstOrDefaultAsync(ci => ci.VehicleId == updateData.VehicleId && ci.Id != id);
                if (duplicateInsurance != null)
                {
                    return BadRequest("This vehicle already has an insurance assigned.");
                }

                // Validate dates
                if (updateData.EndDate <= updateData.StartDate)
                {
                    return BadRequest("End date must be after start date");
                }

                // Update the existing insurance
                existingInsurance.PolicyNumber = updateData.PolicyNumber;
                existingInsurance.VehicleId = updateData.VehicleId;
                existingInsurance.ClientName = updateData.ClientName;
                existingInsurance.ClientEmail = updateData.ClientEmail;
                existingInsurance.StartDate = updateData.StartDate;
                existingInsurance.EndDate = updateData.EndDate;
                existingInsurance.CoverageDetails = updateData.CoverageDetails;
                existingInsurance.Price = updateData.Price;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating car insurance with ID: {InsuranceId}", id);
                return StatusCode(500, "An error occurred while updating the insurance");
            }
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

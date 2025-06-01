using AutoSallonSolution.Data;
using AutoSallonSolution.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AutoSallonSolution.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarInsuranceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public CarInsuranceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CarInsurance>>> GetAll()
        {
            return await _context.CarInsurances.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<CarInsurance>> Create(CarInsurance insurance)
        {
            insurance.Id = Guid.NewGuid();
            _context.CarInsurances.Add(insurance);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = insurance.Id }, insurance);
        }

        // Add more endpoints as needed (Get by Id, Update, Delete)
    }
}

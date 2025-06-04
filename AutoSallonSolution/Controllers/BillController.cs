using Microsoft.AspNetCore.Mvc;
using AutoSallonSolution.Models;
using AutoSallonSolution.Data;

[Route("api/[controller]")]
[ApiController]
public class BillsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public BillsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Bills
    [HttpGet]
    public IActionResult GetBills()
    {
        return Ok(_context.Bills.ToList());
    }

    // POST: api/Bills
    [HttpPost]
    public IActionResult CreateBill([FromBody] Bill bill)
    {
        if (bill == null)
            return BadRequest();

        // Check if a bill already exists for this CarId
        var existingBill = _context.Bills.FirstOrDefault(b => b.CarId == bill.CarId);
        if (existingBill != null)
            return Conflict("A bill for this car already exists.");

        bill.Id = Guid.NewGuid();
        _context.Bills.Add(bill);
        _context.SaveChanges();
        return Ok(bill);
    }

    // PUT: api/Bills/{id}
    [HttpPut("{id}")]
    public IActionResult UpdateBill(Guid id, [FromBody] Bill bill)
    {
        if (bill == null || id != bill.Id)
            return BadRequest();

        var existingBill = _context.Bills.Find(id);
        if (existingBill == null)
            return NotFound();

        // Update properties
        existingBill.ClientName = bill.ClientName;
        existingBill.ClientEmail = bill.ClientEmail;
        existingBill.CarId = bill.CarId;
        existingBill.Amount = bill.Amount;
        existingBill.Description = bill.Description;
        existingBill.Date = bill.Date;

        _context.SaveChanges();
        return Ok(existingBill);
    }

    // DELETE: api/Bills/{id}
    [HttpDelete("{id}")]
    public IActionResult DeleteBill(Guid id)
    {
        var bill = _context.Bills.Find(id);
        if (bill == null)
            return NotFound();

        _context.Bills.Remove(bill);
        _context.SaveChanges();
        return NoContent();
    }
}

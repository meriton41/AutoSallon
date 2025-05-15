using AutoSallonSolution.Data;
using AutoSallonSolution.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using AutoSallonSolution.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;

[ApiController]
[Route("api/[controller]")]
[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]

public class WebsiteRatingsController : ControllerBase
{
    private readonly IMongoCollection<WebsiteRating> _ratingsCollection;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ILogger<WebsiteRatingsController> _logger;

    public WebsiteRatingsController(
        MongoDbService mongoDbService,
        UserManager<ApplicationUser> userManager,
        ILogger<WebsiteRatingsController> logger)
    {
        _ratingsCollection = mongoDbService.Database?.GetCollection<WebsiteRating>("WebsiteRatings");
        _userManager = userManager;
        _logger = logger;
    }

    // POST: api/WebsiteRatings
    [HttpPost]
    public async Task<IActionResult> SubmitRating([FromBody] RatingSubmissionDTO dto)
    {
        try
        {
            if (dto.Value < 1 || dto.Value > 5)
                return BadRequest("Rating must be between 1 and 5");

            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            // Check if user already submitted a rating
            var existingRating = await _ratingsCollection
                .Find(r => r.UserId == user.Id)
                .FirstOrDefaultAsync();

            if (existingRating != null)
                return BadRequest("You have already submitted a rating");

            var rating = new WebsiteRating
            {
                Value = dto.Value,
                Comment = dto.Comment,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow
            };

            await _ratingsCollection.InsertOneAsync(rating);
            return Ok(rating);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error submitting rating");
            return StatusCode(500, "An error occurred while submitting your rating");
        }
    }


    // GET: api/WebsiteRatings
    [HttpGet]
    public async Task<IActionResult> GetAllRatings()
    {
        try
        {
            var ratings = await _ratingsCollection.Find(_ => true).ToListAsync();
            return Ok(ratings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all ratings");
            return StatusCode(500, "An error occurred while retrieving ratings");
        }
    }

    // GET: api/WebsiteRatings/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<WebsiteRating>> GetRating(string id)
    {
        try
        {
            var rating = await _ratingsCollection.Find(r => r.Id == id).FirstOrDefaultAsync();
            return rating == null ? NotFound() : Ok(rating);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting rating with ID {RatingId}", id);
            return StatusCode(500, "An error occurred while retrieving the rating");
        }
    }

    // PUT: api/WebsiteRatings/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRating(string id, [FromBody] WebsiteRating updatedRating)
    {
        try
        {
            var existingRating = await _ratingsCollection.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (existingRating == null)
            {
                _logger.LogWarning("Rating with ID {RatingId} not found for update", id);
                return NotFound();
            }

            var user = await _userManager.GetUserAsync(User);
            if (user?.Id != existingRating.UserId)
            {
                _logger.LogWarning("User {UserId} not authorized to update rating {RatingId}", user?.Id, id);
                return Forbid();
            }

            updatedRating.Id = id;
            updatedRating.UserId = existingRating.UserId;
            updatedRating.CreatedAt = existingRating.CreatedAt;

            await _ratingsCollection.ReplaceOneAsync(r => r.Id == id, updatedRating);

            _logger.LogInformation("Rating {RatingId} updated successfully", id);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating rating with ID {RatingId}", id);
            return StatusCode(500, "An error occurred while updating the rating");
        }
    }

    // DELETE: api/WebsiteRatings/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRating(string id)
    {
        try
        {
            var rating = await _ratingsCollection.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (rating == null)
            {
                _logger.LogWarning("Rating with ID {RatingId} not found for deletion", id);
                return NotFound();
            }

            var user = await _userManager.GetUserAsync(User);
            if (user?.Id != rating.UserId)
            {
                _logger.LogWarning("User {UserId} not authorized to delete rating {RatingId}", user?.Id, id);
                return Forbid();
            }

            await _ratingsCollection.DeleteOneAsync(r => r.Id == id);

            _logger.LogInformation("Rating {RatingId} deleted successfully", id);

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting rating with ID {RatingId}", id);
            return StatusCode(500, "An error occurred while deleting the rating");
        }
    }
    // Add this new endpoint to your WebsiteRatingsController
    [HttpGet("hasRated")]
    public async Task<IActionResult> HasUserRated()
    {
        try
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized();

            var existingRating = await _ratingsCollection
                .Find(r => r.UserId == user.Id)
                .FirstOrDefaultAsync();

            return Ok(new { hasRated = existingRating != null });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if user has rated");
            return StatusCode(500, "An error occurred while checking rating status");
        }
    }


}

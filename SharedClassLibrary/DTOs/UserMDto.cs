using System.ComponentModel.DataAnnotations;

namespace SharedClassLibrary.DTOs
{
public class UserMDto
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Role { get; set; }
    public DateTime CreatedAt { get; set; }
}
}
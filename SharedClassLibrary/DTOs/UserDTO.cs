﻿using System.ComponentModel.DataAnnotations;

namespace SharedClassLibrary.DTOs
{
    public class UserDTO
    {
        public string? Id { get; set; }
        [Required]
        public string UserName { get; set; } = string.Empty;
        [Required]
        [EmailAddress]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; } = string.Empty;
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; } = string.Empty;
        [Required]
        [DataType(DataType.Password)]
        [Compare(nameof(Password))]
        public string ConfirmPassword { get; set; } = string.Empty;

    }
}
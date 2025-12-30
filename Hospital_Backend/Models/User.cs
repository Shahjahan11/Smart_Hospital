
using System;
using System.ComponentModel.DataAnnotations;

namespace Smart_Hospital.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string Role { get; set; } 
        public string? RefreshToken { get; set; } 
        public DateTime? RefreshTokenExpiry { get; set; }  
    }
}
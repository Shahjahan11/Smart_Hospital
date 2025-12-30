using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Hospital.Models
{
    public class Doctor
    {
        public int Id { get; set; }
        [Required]
        public string FullName { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string? Phone { get; set; }
        [Required]
        public string Specialization { get; set; } = "General";
        public string? Qualification { get; set; }
        public int? ExperienceYears { get; set; }
        public string? Department { get; set; }

        public int? UserId { get; set; }
        public User? User { get; set; }

        public bool IsAvailable { get; set; } = true;
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        
        public string? ProfileImage { get; set; }
        public string? Bio { get; set; }
        public ICollection<Appointment> Appointments { get; set; }
    }
}
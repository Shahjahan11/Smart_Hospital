using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Hospital.Models
{
    public class Appointment
    {
        public int Id { get; set; }

        [Required]
        public int DoctorId { get; set; }
        
        [ForeignKey("DoctorId")]
        public Doctor? Doctor { get; set; }

        [Required]
        public int PatientId { get; set; }
        
        [ForeignKey("PatientId")]
        public Patient? Patient { get; set; }

        [Required]
        public DateTime AppointmentDate { get; set; }
        
        public TimeSpan? AppointmentTime { get; set; } 

        [Required]
        public string Status { get; set; } = "Pending"; 

        public string? Reason { get; set; }
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Hospital.Models
{
    public class Bill
    {
        public int Id { get; set; }

        [Required]
        public int AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public Appointment Appointment { get; set; }

        [Required]
        public int PatientId { get; set; }
        [ForeignKey("PatientId")]
        public Patient Patient { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        public string Status { get; set; } = "Unpaid"; 
        
        public DateTime DueDate { get; set; } = DateTime.UtcNow.AddDays(30);
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
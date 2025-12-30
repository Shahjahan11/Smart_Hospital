using System;

namespace Smart_Hospital.DTOs
{
    public class AppointmentDTO
    {
        public int DoctorId { get; set; }
        public int PatientId { get; set; }
        public DateTime AppointmentDate { get; set; }
    }
}
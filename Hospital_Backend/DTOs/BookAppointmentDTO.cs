namespace Smart_Hospital.DTOs
{
    public class BookAppointmentDTO
    {
        public int? DoctorId { get; set; }
        public int? PatientId { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string? Notes { get; set; }
        public string? Phone { get; set; }
    }
}
namespace Smart_Hospital.DTOs
{
    public class DoctorDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string Specialization { get; set; }
        public bool IsAvailable { get; set; } = true;
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public int? UserId { get; set; }
    }
}
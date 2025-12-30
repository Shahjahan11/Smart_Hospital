namespace Smart_Hospital.DTOs
{
    public class BillDTO
    {
        public int AppointmentId { get; set; }
        public int PatientId { get; set; }
        public decimal Amount { get; set; }
    }
}
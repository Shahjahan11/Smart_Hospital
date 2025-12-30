namespace Smart_Hospital.DTOs
{
    public class PaymentDTO
    {
        public int BillId { get; set; }
        public int PatientId { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } 
    }
}

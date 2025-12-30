using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Hospital.Data;
using Smart_Hospital.Models;
using Smart_Hospital.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Smart_Hospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Logged-in users only
    public class PaymentController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public PaymentController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/Payment
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetAllPayments()
        {
            return await _context.Payments
                .Include(p => p.Bill)
                .Include(p => p.Patient)
                .ToListAsync();
        }

        // GET: api/Payment/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<IEnumerable<Payment>>> GetPatientPayments(int patientId)
        {
            var payments = await _context.Payments
                .Where(p => p.PatientId == patientId)
                .Include(p => p.Bill)
                .ToListAsync();

            if (payments.Count == 0)
                return NotFound("No payments found for this patient");

            return payments;
        }

        // POST: api/Payment
        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<Payment>> MakePayment([FromBody] PaymentDTO paymentDto)
        {
            var bill = await _context.Bills.FindAsync(paymentDto.BillId);
            if (bill == null)
                return NotFound("Bill not found");

            var payment = new Payment
            {
                BillId = paymentDto.BillId,
                PatientId = paymentDto.PatientId,
                Amount = paymentDto.Amount,
                PaymentDate = System.DateTime.UtcNow,
                PaymentMethod = paymentDto.PaymentMethod,
                Status = "Completed"
            };

            _context.Payments.Add(payment);

            // Update bill status to Paid
            bill.Status = "Paid";

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPatientPayments), new { patientId = payment.PatientId }, payment);
        }
    }
}
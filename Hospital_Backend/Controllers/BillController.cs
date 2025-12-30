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
    [Authorize] // All logged-in users can access based on role
    public class BillController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public BillController(HospitalDbContext context)
        {
            _context = context;
        }

        // GET: api/Bill
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<IEnumerable<Bill>>> GetAllBills()
        {
            return await _context.Bills
                .Include(b => b.Patient)
                .Include(b => b.Appointment)
                .ToListAsync();
        }

        // GET: api/Bill/patient/{patientId}
        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Patient")]
        public async Task<ActionResult<IEnumerable<Bill>>> GetPatientBills(int patientId)
        {
            var bills = await _context.Bills
                .Where(b => b.PatientId == patientId)
                .Include(b => b.Appointment)
                .ToListAsync();

            if (bills.Count == 0)
                return NotFound("No bills found for this patient");

            return bills;
        }

        // POST: api/Bill
        [HttpPost]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<ActionResult<Bill>> CreateBill([FromBody] BillDTO billDto)
        {
            var appointment = await _context.Appointments.FindAsync(billDto.AppointmentId);
            if (appointment == null)
                return NotFound("Appointment not found");

            var bill = new Bill
            {
                AppointmentId = billDto.AppointmentId,
                PatientId = billDto.PatientId,
                Amount = billDto.Amount,
                Status = "Unpaid"
            };

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllBills), new { id = bill.Id }, bill);
        }

        // PUT: api/Bill/{id}  -> Update status
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Doctor")]
        public async Task<IActionResult> UpdateBillStatus(int id, [FromBody] string status)
        {
            var bill = await _context.Bills.FindAsync(id);
            if (bill == null)
                return NotFound("Bill not found");

            bill.Status = status;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Bill/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteBill(int id)
        {
            var bill = await _context.Bills.FindAsync(id);
            if (bill == null)
                return NotFound("Bill not found");

            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
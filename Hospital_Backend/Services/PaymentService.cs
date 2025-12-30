using Smart_Hospital.Data;
using Smart_Hospital.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using System;

namespace Smart_Hospital.Services
{
    public class PaymentService
    {
        private readonly HospitalDbContext _context;

        public PaymentService(HospitalDbContext context)
        {
            _context = context;
        }

        public async Task<List<Payment>> GetAllPaymentsAsync()
        {
            return await _context.Payments
                .Include(p => p.Bill)
                .Include(p => p.Patient)
                .ToListAsync();
        }

        public async Task<List<Payment>> GetPatientPaymentsAsync(int patientId)
        {
            return await _context.Payments
                .Where(p => p.PatientId == patientId)
                .Include(p => p.Bill)
                .ToListAsync();
        }

        public async Task<Payment> MakePaymentAsync(Payment payment)
        {
            _context.Payments.Add(payment);

            // Update bill status automatically
            var bill = await _context.Bills.FindAsync(payment.BillId);
            if (bill != null)
            {
                bill.Status = "Paid";
            }

            await _context.SaveChangesAsync();
            return payment;
        }
    }
}

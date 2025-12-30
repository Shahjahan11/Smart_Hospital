using Smart_Hospital.Data;
using Smart_Hospital.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Smart_Hospital.Services
{
    public class BillService
    {
        private readonly HospitalDbContext _context;

        public BillService(HospitalDbContext context)
        {
            _context = context;
        }

        public async Task<List<Bill>> GetAllBillsAsync()
        {
            return await _context.Bills
                .Include(b => b.Patient)
                .Include(b => b.Appointment)
                .ToListAsync();
        }

        public async Task<List<Bill>> GetPatientBillsAsync(int patientId)
        {
            return await _context.Bills
                .Where(b => b.PatientId == patientId)
                .Include(b => b.Appointment)
                .ToListAsync();
        }

        public async Task<Bill> CreateBillAsync(Bill bill)
        {
            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();
            return bill;
        }

        public async Task UpdateBillAsync(Bill bill)
        {
            _context.Bills.Update(bill);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBillAsync(Bill bill)
        {
            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();
        }
    }
}

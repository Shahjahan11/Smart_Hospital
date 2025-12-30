using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Hospital.Data;
using Smart_Hospital.Models;
using Smart_Hospital.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Smart_Hospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AppointmentController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public AppointmentController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllAppointments()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { error = "User not authenticated" });

                var userId = int.Parse(userIdClaim);
                var user = await _context.Users.FindAsync(userId);
                
                if (user == null) return Unauthorized(new { error = "User not found" });

                var query = _context.Appointments
                    .Include(a => a.Doctor)
                    .Include(a => a.Patient)
                    .AsQueryable();

                if (user.Role == "Doctor")
                {
                    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                    if (doctor != null)
                    {
                        query = query.Where(a => a.DoctorId == doctor.Id);
                    }
                }
                else if (user.Role == "Patient")
                {
                    var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                    if (patient != null)
                    {
                        query = query.Where(a => a.PatientId == patient.Id);
                    }
                }

                var appointments = await query.OrderByDescending(a => a.AppointmentDate).ToListAsync();

                var result = appointments.Select(a => new
                {
                    a.Id,
                    a.AppointmentDate,
                    Date = a.AppointmentDate.ToString("dddd, MMMM d, yyyy"),
                    Time = a.AppointmentDate.ToString("h:mm tt"),
                    a.Status,
                    a.Reason,
                    
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor?.FullName ?? "Unknown Doctor",
                    DoctorSpecialization = a.Doctor?.Specialization ?? "N/A",
                    DoctorEmail = a.Doctor?.Email ?? "N/A",
                    
                    PatientId = a.PatientId,
                    PatientName = a.Patient?.FullName ?? "Unknown Patient",
                    PatientEmail = a.Patient?.Email ?? "N/A",
                    PatientPhone = a.Patient?.Phone ?? "N/A",
                    
                    IsMyAppointment = true
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Error: {ex.Message}" });
            }
        }

        [HttpPost("book")]
        [Authorize(Roles = "Patient,Admin")]
        public async Task<ActionResult<object>> BookAppointment([FromBody] BookAppointmentDTO bookDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { error = "User not authenticated" });

                var userId = int.Parse(userIdClaim);
                var user = await _context.Users.FindAsync(userId);
                
                if (user == null) return Unauthorized(new { error = "User not found" });

                if (!bookDto.DoctorId.HasValue)
                    return BadRequest(new { error = "Doctor is required" });

                var doctor = await _context.Doctors.FindAsync(bookDto.DoctorId.Value);
                if (doctor == null)
                    return BadRequest(new { error = "Doctor not found" });

                Patient patient;
                
                if (user.Role == "Patient")
                {
                    patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                    
                    if (patient == null)
                    {
                        patient = new Patient
                        {
                            FullName = user.FullName,
                            Email = user.Email,
                            Phone = bookDto.Phone ?? "Not provided",
                            UserId = userId,
                            CreatedAt = DateTime.UtcNow
                        };
                        _context.Patients.Add(patient);
                        await _context.SaveChangesAsync();
                    }
                }
                else if (user.Role == "Admin" && bookDto.PatientId.HasValue)
                {
                    patient = await _context.Patients.FindAsync(bookDto.PatientId.Value);
                    if (patient == null) return BadRequest(new { error = "Patient not found" });
                }
                else
                {
                    return BadRequest(new { error = "Invalid request" });
                }

                var appointment = new Appointment
                {
                    DoctorId = doctor.Id,
                    PatientId = patient.Id,
                    AppointmentDate = bookDto.AppointmentDateTime,
                    Status = "Pending",
                    Reason = bookDto.Notes,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Appointments.Add(appointment);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    success = true,
                    message = "Appointment booked successfully",
                    appointment = new
                    {
                        appointment.Id,
                        appointment.AppointmentDate,
                        DoctorName = doctor.FullName,
                        PatientName = patient.FullName
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Error: {ex.Message}" });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] UpdateStatusDTO statusDto)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null) return NotFound(new { error = "Appointment not found" });

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { error = "User not authenticated" });

                var userId = int.Parse(userIdClaim);
                var user = await _context.Users.FindAsync(userId);
                
                if (user == null) return Unauthorized(new { error = "User not found" });

                if (user.Role != "Doctor")
                    return Forbid();

                var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                if (doctor == null || appointment.DoctorId != doctor.Id)
                    return Forbid();

                appointment.Status = statusDto.Status;
                appointment.UpdatedAt = DateTime.UtcNow;
                
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Appointment {statusDto.Status.ToLower()}" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Error: {ex.Message}" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null) return NotFound(new { error = "Appointment not found" });

                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { error = "User not authenticated" });

                var userId = int.Parse(userIdClaim);
                var user = await _context.Users.FindAsync(userId);
                
                if (user == null) return Unauthorized(new { error = "User not found" });

                if (user.Role == "Patient")
                {
                    var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                    if (patient == null || appointment.PatientId != patient.Id)
                        return Forbid();
                }
                else if (user.Role == "Doctor")
                {
                    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                    if (doctor == null || appointment.DoctorId != doctor.Id)
                        return Forbid();
                }
                // Admin can delete any appointment

                _context.Appointments.Remove(appointment);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Appointment deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Error: {ex.Message}" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetAppointment(int id)
        {
            try
            {
                var appointment = await _context.Appointments
                    .Include(a => a.Doctor)
                    .Include(a => a.Patient)
                    .FirstOrDefaultAsync(a => a.Id == id);

                if (appointment == null) return NotFound(new { error = "Appointment not found" });

                return Ok(new
                {
                    appointment.Id,
                    appointment.AppointmentDate,
                    appointment.Status,
                    appointment.Reason,
                    Doctor = appointment.Doctor != null ? new
                    {
                        appointment.Doctor.Id,
                        appointment.Doctor.FullName,
                        appointment.Doctor.Specialization,
                        appointment.Doctor.Email
                    } : null,
                    Patient = appointment.Patient != null ? new
                    {
                        appointment.Patient.Id,
                        appointment.Patient.FullName,
                        appointment.Patient.Email,
                        appointment.Patient.Phone
                    } : null
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Error: {ex.Message}" });
            }
        }

        [HttpPut("update/{id}")]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> UpdateAppointmentDetails(int id, [FromBody] UpdateAppointmentDTO updateDto)
        {
            try
            {
                var appointment = await _context.Appointments.FindAsync(id);
                if (appointment == null) return NotFound(new { error = "Appointment not found" });

                // Authorization - only the patient who booked it can update
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized(new { error = "User not authenticated" });

                var userId = int.Parse(userIdClaim);
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                
                if (patient == null || appointment.PatientId != patient.Id)
                    return Forbid();

                // Update fields
                if (!string.IsNullOrEmpty(updateDto.Reason))
                    appointment.Reason = updateDto.Reason;
                
                if (updateDto.AppointmentDateTime.HasValue)
                    appointment.AppointmentDate = updateDto.AppointmentDateTime.Value;
                
                if (updateDto.DoctorId.HasValue)
                {
                    var doctor = await _context.Doctors.FindAsync(updateDto.DoctorId.Value);
                    if (doctor == null)
                        return BadRequest(new { error = "Doctor not found" });
                    appointment.DoctorId = doctor.Id;
                }

                appointment.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new { message = "Appointment updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = $"Error: {ex.Message}" });
            }
        }
    }

    // DTOs
    public class BookAppointmentDTO
    {
        public int? DoctorId { get; set; }
        public int? PatientId { get; set; }
        public DateTime AppointmentDateTime { get; set; }
        public string? Notes { get; set; }
        public string? Phone { get; set; }
    }

    public class UpdateAppointmentDTO
    {
        public string? Reason { get; set; }
        public DateTime? AppointmentDateTime { get; set; }
        public int? DoctorId { get; set; }
    }

    public class UpdateStatusDTO
    {
        public string Status { get; set; } = "Pending";
    }
}
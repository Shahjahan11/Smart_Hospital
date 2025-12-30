
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
    [Authorize(Roles = "Admin,Doctor,Patient")]
    public class DoctorController : ControllerBase
    {
        private readonly HospitalDbContext _context;

        public DoctorController(HospitalDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAllDoctors(
            [FromQuery] string? specialization = null,
            [FromQuery] bool? available = null)
        {
            try
            {
                var query = _context.Doctors.AsQueryable();

                if (!string.IsNullOrEmpty(specialization) && specialization != "All")
                {
                    query = query.Where(d => d.Specialization == specialization);
                }

                if (available.HasValue)
                {
                    query = query.Where(d => d.IsAvailable == available.Value);
                }

                var doctors = await query
                    .Select(d => new
                    {
                        d.Id,
                        d.FullName,
                        d.Email,
                        d.Phone,
                        d.Specialization,
                        d.IsAvailable,
                        d.ExperienceYears,
                        d.Department,
                        d.Qualification,
                        d.Bio,
                        UserId = d.UserId
                    })
                    .OrderBy(d => d.FullName)
                    .ToListAsync();

                if (!doctors.Any() && string.IsNullOrEmpty(specialization))
                {
                    var doctorUsers = await _context.Users
                        .Where(u => u.Role == "Doctor")
                        .ToListAsync();

                    if (doctorUsers.Any())
                    {
                        foreach (var user in doctorUsers)
                        {
                            var existingDoctor = await _context.Doctors
                                .FirstOrDefaultAsync(d => d.Email == user.Email);
                            
                            if (existingDoctor == null)
                            {
                                var doctor = new Doctor
                                {
                                    FullName = user.FullName,
                                    Email = user.Email,
                                    Specialization = "General",
                                    UserId = user.Id,
                                    IsAvailable = true
                                };
                                
                                _context.Doctors.Add(doctor);
                            }
                        }
                        
                        await _context.SaveChangesAsync();
                        
                        doctors = await _context.Doctors
                            .Select(d => new
                            {
                                d.Id,
                                d.FullName,
                                d.Email,
                                d.Phone,
                                d.Specialization,
                                d.IsAvailable,
                                d.ExperienceYears,
                                d.Department,
                                d.Qualification,
                                d.Bio,
                                UserId = d.UserId
                            })
                            .OrderBy(d => d.FullName)
                            .ToListAsync();
                    }
                }

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error getting doctors", details = ex.Message });
            }
        }

        [HttpGet("specializations")]
        public async Task<ActionResult<IEnumerable<string>>> GetSpecializations()
        {
            try
            {
                var specializations = await _context.Doctors
                    .Where(d => !string.IsNullOrEmpty(d.Specialization))
                    .Select(d => d.Specialization)
                    .Distinct()
                    .OrderBy(s => s)
                    .ToListAsync();

                return Ok(specializations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error getting specializations", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetDoctorById(int id)
        {
            try
            {
                var doctor = await _context.Doctors
                    .Include(d => d.User)
                    .Where(d => d.Id == id)
                    .Select(d => new
                    {
                        d.Id,
                        d.FullName,
                        d.Email,
                        d.Phone,
                        d.Specialization,
                        d.IsAvailable,
                        d.AvailableFrom,
                        d.AvailableTo,
                        d.ExperienceYears,
                        d.Department,
                        d.Qualification,
                        d.Bio,
                        d.ProfileImage,
                        UserId = d.UserId,
                        User = d.User != null ? new
                        {
                            d.User.Id,
                            d.User.FullName,
                            d.User.Email,
                            d.User.Role
                        } : null
                    })
                    .FirstOrDefaultAsync();
                    
                if (doctor == null)
                    return NotFound("Doctor not found");

                return Ok(doctor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error getting doctor", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<object>> CreateDoctor([FromBody] CreateDoctorDTO doctorDto)
        {
            try
            {
                if (await _context.Doctors.AnyAsync(d => d.Email == doctorDto.Email))
                    return BadRequest("Doctor with this email already exists");

                var doctor = new Doctor
                {
                    FullName = doctorDto.FullName,
                    Email = doctorDto.Email,
                    Phone = doctorDto.Phone,
                    Specialization = doctorDto.Specialization ?? "General",
                    Qualification = doctorDto.Qualification,
                    ExperienceYears = doctorDto.ExperienceYears,
                    Department = doctorDto.Department,
                    IsAvailable = doctorDto.IsAvailable,
                    AvailableFrom = doctorDto.AvailableFrom,
                    AvailableTo = doctorDto.AvailableTo,
                    Bio = doctorDto.Bio,
                    UserId = doctorDto.UserId
                };

                _context.Doctors.Add(doctor);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDoctorById), new { id = doctor.Id }, new
                {
                    doctor.Id,
                    doctor.FullName,
                    doctor.Email,
                    doctor.Specialization,
                    doctor.Phone,
                    Message = "Doctor created successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error creating doctor", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDoctor(int id, [FromBody] UpdateDoctorDTO doctorDto)
        {
            try
            {
                var doctor = await _context.Doctors.FindAsync(id);
                if (doctor == null)
                    return NotFound("Doctor not found");

                doctor.FullName = doctorDto.FullName;
                doctor.Email = doctorDto.Email;
                doctor.Phone = doctorDto.Phone;
                doctor.Specialization = doctorDto.Specialization;
                doctor.Qualification = doctorDto.Qualification;
                doctor.ExperienceYears = doctorDto.ExperienceYears;
                doctor.Department = doctorDto.Department;
                doctor.IsAvailable = doctorDto.IsAvailable;
                doctor.AvailableFrom = doctorDto.AvailableFrom;
                doctor.AvailableTo = doctorDto.AvailableTo;
                doctor.Bio = doctorDto.Bio;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Doctor updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Error updating doctor", details = ex.Message });
            }
        }
    }

    public class CreateDoctorDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string Specialization { get; set; } = "General";
        public string? Qualification { get; set; }
        public int? ExperienceYears { get; set; }
        public string? Department { get; set; }
        public bool IsAvailable { get; set; } = true;
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public string? Bio { get; set; }
        public int? UserId { get; set; }
    }

    public class UpdateDoctorDTO
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string Specialization { get; set; }
        public string? Qualification { get; set; }
        public int? ExperienceYears { get; set; }
        public string? Department { get; set; }
        public bool IsAvailable { get; set; }
        public DateTime? AvailableFrom { get; set; }
        public DateTime? AvailableTo { get; set; }
        public string? Bio { get; set; }
    }
}
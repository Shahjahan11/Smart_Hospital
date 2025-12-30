using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Smart_Hospital.Data;
using Smart_Hospital.Models;
using Smart_Hospital.DTOs;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Smart_Hospital.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly HospitalDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(HospitalDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDTO userDto)
        {
            try
            {
                if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
                    return BadRequest("Email already exists");

                var user = new User
                {
                    FullName = userDto.FullName,
                    Email = userDto.Email,
                    Role = userDto.Role,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password),
                    RefreshToken = Guid.NewGuid().ToString(),
                    RefreshTokenExpiry = DateTime.UtcNow.AddDays(7)
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                // 🔥 AUTO-CREATE PATIENT RECORD IF ROLE IS PATIENT
                if (userDto.Role == "Patient")
                {
                    var patient = new Patient
                    {
                        FullName = userDto.FullName,
                        Email = userDto.Email,
                        Phone = userDto.Phone ?? "Not provided",
                        UserId = user.Id, // This is critical!
                        CreatedAt = DateTime.UtcNow
                    };
                    
                    _context.Patients.Add(patient);
                    await _context.SaveChangesAsync();
                }

                return Ok(new { 
                    message = "User registered successfully",
                    userId = user.Id,
                    role = user.Role
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Registration error: {ex.Message}");
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO loginDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                    return Unauthorized("Invalid credentials");

                var token = GenerateJwtToken(user);
                var refreshToken = Guid.NewGuid().ToString();

                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
                await _context.SaveChangesAsync();

                int? doctorId = null;
                int? patientId = null;
                
                if (user.Role == "Doctor")
                {
                    var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == user.Id);
                    doctorId = doctor?.Id;
                }
                else if (user.Role == "Patient")
                {
                    var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == user.Id);
                    patientId = patient?.Id;
                }

                return Ok(new
                {
                    token,
                    refreshToken,
                    user = new {
                        id = user.Id,
                        fullName = user.FullName,
                        email = user.Email,
                        role = user.Role,
                        doctorId,
                        patientId
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Login error: {ex.Message}");
            }
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDTO tokenDto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(u => u.RefreshToken == tokenDto.RefreshToken);

                if (user == null || user.RefreshTokenExpiry < DateTime.UtcNow)
                    return Unauthorized("Invalid or expired refresh token");

                var newToken = GenerateJwtToken(user);
                var newRefreshToken = Guid.NewGuid().ToString();

                user.RefreshToken = newRefreshToken;
                user.RefreshTokenExpiry = DateTime.UtcNow.AddDays(7);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    token = newToken,
                    refreshToken = newRefreshToken
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Refresh token error: {ex.Message}");
            }
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
                var user = await _context.Users.FindAsync(userId);
                
                if (user == null)
                    return NotFound("User not found");
                
                Doctor doctorInfo = null;
                Patient patientInfo = null;
                
                if (user.Role == "Doctor")
                {
                    doctorInfo = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                }
                else if (user.Role == "Patient")
                {
                    patientInfo = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                }

                return Ok(new
                {
                    id = user.Id,
                    fullName = user.FullName,
                    email = user.Email,
                    role = user.Role,
                    doctor = doctorInfo,
                    patient = patientInfo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error getting user info: {ex.Message}");
            }
        }


        [HttpPost("fix-patient-links")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> FixPatientLinks()
        {
            try
            {
                Console.WriteLine("=== Fixing Patient Links ===");
                
                var patientUsers = await _context.Users
                    .Where(u => u.Role == "Patient")
                    .ToListAsync();
                
                int fixedCount = 0;
                
                foreach (var user in patientUsers)
                {
                    var existingPatient = await _context.Patients
                        .FirstOrDefaultAsync(p => p.UserId == user.Id || p.Email == user.Email);
                    
                    if (existingPatient == null)
                    {
                        var patient = new Patient
                        {
                            FullName = user.FullName,
                            Email = user.Email,
                            Phone = "Not provided",
                            UserId = user.Id,
                            CreatedAt = DateTime.UtcNow
                        };
                        
                        _context.Patients.Add(patient);
                        Console.WriteLine($"Created patient for user: {user.Email}");
                        fixedCount++;
                    }
                    else if (existingPatient.UserId == null)
                    {
                        existingPatient.UserId = user.Id;
                        Console.WriteLine($"Linked patient to user: {user.Email}");
                        fixedCount++;
                    }
                }
                
                await _context.SaveChangesAsync();
                
                return Ok(new { 
                    message = $"Fixed {fixedCount} patient records",
                    totalPatientUsers = patientUsers.Count
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
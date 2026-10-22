using AuthService.DTOs;

namespace AuthService.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        string GenerateJwtToken(string username, string role);
    }
}

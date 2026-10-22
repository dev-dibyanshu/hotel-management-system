namespace AuthService.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public required string Username { get; set; }
        public required string Role { get; set; }
        public required string Email { get; set; }
    }

    public class CreateUserDto
    {
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }
        public required string Email { get; set; }
    }

    public class UpdateUserDto
    {
        public required string Username { get; set; }
        public string? Password { get; set; }
        public required string Role { get; set; }
        public required string Email { get; set; }
    }
}

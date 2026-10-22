namespace GuestService.DTOs
{
    public class GuestDto
    {
        public int Id { get; set; }
        public required string MemberCode { get; set; }
        public required string PhoneNumber { get; set; }
        public string? Company { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Gender { get; set; }
        public required string Address { get; set; }
    }

    public class CreateGuestDto
    {
        public required string MemberCode { get; set; }
        public required string PhoneNumber { get; set; }
        public string? Company { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Gender { get; set; }
        public required string Address { get; set; }
    }

    public class UpdateGuestDto
    {
        public required string MemberCode { get; set; }
        public required string PhoneNumber { get; set; }
        public string? Company { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Gender { get; set; }
        public required string Address { get; set; }
    }
}

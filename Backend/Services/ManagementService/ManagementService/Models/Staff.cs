namespace ManagementService.Models
{
    public class Staff
    {
        public int Id { get; set; }
        public required string Code { get; set; }
        public required string EmployeeName { get; set; }
        public required string EmployeeAddress { get; set; }
        public required string NIC { get; set; }
        public decimal Salary { get; set; }
        public int Age { get; set; }
        public required string Occupation { get; set; }
        public required string Email { get; set; }
    }
}

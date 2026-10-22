namespace ManagementService.DTOs
{
    public class StaffDto
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

    public class CreateStaffDto
    {
        public required string Code { get; set; }
        public required string EmployeeName { get; set; }
        public required string EmployeeAddress { get; set; }
        public required string NIC { get; set; }
        public decimal Salary { get; set; }
        public int Age { get; set; }
        public required string Occupation { get; set; }
        public required string Email { get; set; }
    }

    public class UpdateStaffDto
    {
        public required string Code { get; set; }
        public required string EmployeeName { get; set; }
        public required string EmployeeAddress { get; set; }
        public required string NIC { get; set; }
        public decimal Salary { get; set; }
        public int Age { get; set; }
        public required string Occupation { get; set; }
        public required string Email { get; set; }
    }

    public class InventoryDto
    {
        public int Id { get; set; }
        public required string ItemName { get; set; }
        public int Quantity { get; set; }
    }

    public class CreateInventoryDto
    {
        public required string ItemName { get; set; }
        public int Quantity { get; set; }
    }

    public class UpdateInventoryDto
    {
        public required string ItemName { get; set; }
        public int Quantity { get; set; }
    }

    public class DepartmentDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
    }

    public class CreateDepartmentDto
    {
        public required string Name { get; set; }
    }

    public class UpdateDepartmentDto
    {
        public required string Name { get; set; }
    }
}

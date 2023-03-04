using MySqlConnector;

namespace MISA.API.Entities
{
    public class Employee
    {
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public int Gender { get; set; }
        public DateTime BirthDate { get; set; }
        public string IdentityNumber { get; set;}
        public string PositionName { get; set; }
        public string DepartmentName { get; set; }
        public string AccountNumber { get; set; }
        public string BankName { get; set; }
        public string AccountFranchiseName { get; set; }    
        public string PhoneNumber { get; set;}
        public DateTime IssuedDate { get; set; }
        public string IssuedPlace { get; set; }
        public string Email { get; set; }
        public string StationPhone { get; set; }
    }
}

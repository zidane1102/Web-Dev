using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.API.Entities;
using MySqlConnector;
using System.Collections.Generic;
using System.Net.NetworkInformation;
using System.Reflection.Metadata;
using System.Security.Cryptography;

namespace MISA.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeesController : ControllerBase
    {
        [HttpDelete]
        [Route("Delete")]
        public IActionResult DeleteEmployee(
            [FromQuery] string? employeeCode)
        {
            string connectionstring = "Server=18.179.16.166;Port=3306;Database=DAOTAO.AI.2023.HĐDUY;Uid=nvmanh;Pwd=12345678;";
            var mySqlconnection = new MySqlConnection(connectionstring);
            try
            {
                var parameters = new DynamicParameters();
                string deletecommand = "DELETE FROM employee WHERE EmployeeCode = @EmployeeCode;";
                parameters.Add("@EmployeeCode", employeeCode);
                int numberofAffectedRows = mySqlconnection.Execute(deletecommand, parameters);

                if (numberofAffectedRows > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, "Đã xóa thành công nhân viên");
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        [HttpGet]
        [Route("Filter")]

        public IActionResult Filter(
            [FromQuery] int? offset,
            [FromQuery] int? limit)
        {

            string connectionstring = "Server=18.179.16.166;Port=3306;Database=DAOTAO.AI.2023.HĐDUY;Uid=nvmanh;Pwd=12345678;";
            var mySqlconnection = new MySqlConnection(connectionstring);
            try
            {
                string storedProceduresfilter = "filter";
                
                var parameters = new DynamicParameters();
                parameters.Add("@v_offset", (offset - 1) * limit);
                parameters.Add("@v_limit", limit);

                var multipleresults = mySqlconnection.QueryMultiple(storedProceduresfilter, parameters, commandType: System.Data.CommandType.StoredProcedure);

                if (multipleresults != null)
                {
                    var employee = multipleresults.Read<Employee>().ToList();
                    return StatusCode(StatusCodes.Status200OK, employee);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
        [HttpGet]
        [Route("FilterCon")]

        public IActionResult FilterEmployeesCon(
            [FromQuery] string? keyword,
            [FromQuery] int? offset,
            [FromQuery] int? limit,
            [FromQuery] string? positionName,
            [FromQuery] string? departmentName)
        {
            string connectionstring = "Server=18.179.16.166;Port=3306;Database=DAOTAO.AI.2023.HĐDUY;Uid=nvmanh;Pwd=12345678;";
            var mySqlconnection = new MySqlConnection(connectionstring);
            try
            {
                string storedProceduresfilter = "filter_v2";

                var parameters = new DynamicParameters();
                parameters.Add("@v_offset", (offset - 1) * limit);
                parameters.Add("@v_limit", limit);
                parameters.Add("@v_sort", "");

                var orConditions = new List<string>();
                var andConditions = new List<string>();
                string whereclause = "";
                if (keyword != null)
                {
                    orConditions.Add($"EmployeeCode LIKE '%{keyword}%'");
                    orConditions.Add($"EmployeeName LIKE '%{keyword}%'");
                }
                if (orConditions.Count > 0)
                {
                    whereclause = $"{string.Join(" OR ", orConditions)}";
                }
                if (positionName != null)
                {
                    andConditions.Add($"PositionName LIKE '%{positionName}%'");
                }
                if (departmentName != null)
                {
                    andConditions.Add($"DepartmentName LIKE '%{departmentName}%'");
                }
                if (andConditions.Count > 0)
                {
                    whereclause += $" AND {string.Join(" AND ", andConditions)}";
                }
                parameters.Add("@v_where", whereclause);
                var multipleresults = mySqlconnection.QueryMultiple(storedProceduresfilter, parameters, commandType: System.Data.CommandType.StoredProcedure);

                if (multipleresults != null)
                {
                    var employee = multipleresults.Read<Employee>().ToList();
                    var totalcount = multipleresults.Read<int>().Single();
                    return StatusCode(StatusCodes.Status200OK, new PagingData()
                    {
                        Data = employee,
                        TotalCount = totalcount
                    });
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
        [HttpGet]
        [Route("")]
        public IActionResult GetAllEmployees()
        {

            string connectionstring = "Server=18.179.16.166;Port=3306;Database=DAOTAO.AI.2023.HĐDUY;Uid=nvmanh;Pwd=12345678;";
            var mySqlconnection = new MySqlConnection(connectionstring);
            try {

                string getAllEmployees = "SELECT * FROM employee;";

                var employees = mySqlconnection.Query<Employee>(getAllEmployees);

                if (employees != null)
                {
                    return StatusCode(StatusCodes.Status200OK, employees);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }

        [HttpPut]
        [Route("{employeeCode}")]

        public IActionResult UpdateEmployee(
            [FromRoute] string? employeeCode,
            [FromBody] Employee employee)
        {
            string connectionstring = "Server=18.179.16.166;Port=3306;Database=DAOTAO.AI.2023.HĐDUY;Uid=nvmanh;Pwd=12345678;";
            var mySqlconnection = new MySqlConnection(connectionstring);
            try
            {
                string updateemployeecommand = "UPDATE employee " +
                    "SET " +
                    "EmployeeCode = @newEmployeeCode," +
                    "EmployeeName = @EmployeeName, " +
                    "Gender = @Gender, " +
                    "BirthDate = @BirthDate, " +
                    "IdentityNumber = @IdentityNumber, " +
                    "PositionName = @PositionName, " +
                    "DepartmentName = @DepartmentName, " +
                    "AccountNumber = @AccountNumber, " +
                    "BankName = @BankName, " +
                    "AccountFranchiseName = @AccountFranchiseName, " +
                    "IssuedDate = @IssuedDate, " +
                    "IssuedPlace = @IssuedPlace, " +
                    "StationPhone = @StationPhone, " +
                    "PhoneNumber = @PhoneNumber " +
                    "WHERE EmployeeCode = @EmployeeCode;";

                var parameters = new DynamicParameters();

                parameters.Add("@EmployeeCode", employeeCode);
                parameters.Add("@newEmployeeCode", employee.EmployeeCode);
                parameters.Add("@EmployeeName", employee.EmployeeName);
                parameters.Add("@BirthDate", employee.BirthDate);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@IdentityNumber", employee.IdentityNumber);
                parameters.Add("@PositionName", employee.PositionName);
                parameters.Add("@DepartmentName", employee.DepartmentName);
                parameters.Add("@AccountFranchiseName", employee.AccountFranchiseName);
                parameters.Add("@AccountNumber", employee.AccountNumber);
                parameters.Add("@BankName", employee.BankName);
                parameters.Add("@IssuedDate", employee.IssuedDate);
                parameters.Add("@IssuedPlace", employee.IssuedPlace);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@StationPhone", employee.StationPhone);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);

                int numberofAffectedRowsemp = mySqlconnection.Execute(updateemployeecommand, parameters);

                if (numberofAffectedRowsemp > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, employee);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
        [HttpPost]
        [Route("")]

        public IActionResult InsertEmployee(
            [FromBody] Employee employee)
        {
            string connectionstring = "Server=18.179.16.166;Port=3306;Database=DAOTAO.AI.2023.HĐDUY;Uid=nvmanh;Pwd=12345678;";
            var mySqlconnection = new MySqlConnection(connectionstring);
            try
            {
                string insertemployeecommand = "INSERT INTO employee (EmployeeCode, EmployeeName, " +
                    "BirthDate, Gender, IdentityNumber, PositionName, DepartmentName, AccountFranchiseName, " +
                    "AccountNumber, BankName, PhoneNumber, IssuedDate, IssuedPlace, Email) " +
                    "VALUES (@EmployeeCode, @EmployeeName, @BirthDate, @Gender, @IdentityNumber, " +
                    "@PositionName,@DepartmentName, @AccountFranchiseName, @AccountNumber, @BankName, " +
                    "@PhoneNumber, @IssuedDate, @IssuedPlace, @Email);";

                var parameters = new DynamicParameters();

                parameters.Add("@EmployeeCode", employee.EmployeeCode);
                parameters.Add("@EmployeeName", employee.EmployeeName);
                parameters.Add("@BirthDate", employee.BirthDate);
                parameters.Add("@Gender", employee.Gender);
                parameters.Add("@IdentityNumber", employee.IdentityNumber);
                parameters.Add("@PositionName", employee.PositionName);
                parameters.Add("@DepartmentName", employee.DepartmentName);
                parameters.Add("@AccountFranchiseName", employee.AccountFranchiseName);
                parameters.Add("@AccountNumber", employee.AccountNumber);
                parameters.Add("@BankName", employee.BankName);
                parameters.Add("@IssuedDate", employee.IssuedDate);
                parameters.Add("@IssuedPlace", employee.IssuedPlace);
                parameters.Add("@Email", employee.Email);
                parameters.Add("@StationPhone", employee.StationPhone);
                parameters.Add("@PhoneNumber", employee.PhoneNumber);

                int numberofAffectedRowsemp = mySqlconnection.Execute(insertemployeecommand, parameters);

                if (numberofAffectedRowsemp > 0)
                {
                    return StatusCode(StatusCodes.Status201Created, employee.EmployeeCode);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e002");
                }
            }
            catch (MySqlException mysqlException)
            {
                if (mysqlException.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "e003");
                }
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
            catch (Exception exception)
            {
                Console.WriteLine(exception.Message);
                return StatusCode(StatusCodes.Status400BadRequest, "e001");
            }
        }
    }
}


using MarketPlace.Business.Services.Interface;
using MarketPlace.Business.Services.Services;
using MarketPlace.Common.APIResponse;
using MarketPlace.Common.DTOs;
using MarketPlace.Common.DTOs.ResponseModels;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketPlace.Common.DTOs.RequestModels;
using System.Text;

[ApiController]
    [Route("auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _auth;


        public AuthController(IAuthService auth) => _auth = auth;

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            var result = await _auth.LoginAsync(req);
            if (!result.Success) return Unauthorized(result);
            return Ok(result);
        }

        [Authorize]
        [HttpGet("check")]
        public async Task<IActionResult> Check()
        {
            var result = await _auth.CheckAuth(User);
            if (!result.Success) return Unauthorized(result); 
            return Ok(result); // APIResponse<AuthDto>
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var result = await _auth.RefreshTokenAsync();
            if (!result.Success) return Unauthorized(result);
            return Ok(result);
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var result = await _auth.LogoutAsync();
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUser dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _auth.RegisterAsync(dto);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        }

    [HttpGet("GetRegisterUser")]
    public async Task<IActionResult> GetUsers(int page = 1, int pageSize = 10, string? role = null)
    {
        if (page <= 0 || pageSize <= 0)
        {
            return BadRequest(new APIResponse<PagedData<RegisterUserResponce>>
            {
                Success = false,
                Data = null,
                Message = "Page and pageSize must be greater than zero."
            });
        }

        var pagedUsers = await _auth.GetList(page, pageSize, role);

        return Ok(new APIResponse<PagedData<RegisterUserResponce>>
        {
            Success = true,
            Data = pagedUsers,
            Message = role == null
                ? "All users retrieved successfully."
                : $"Users with role '{role}' retrieved successfully."
        });
    }

    [HttpGet("DownloadRegisterUsers")]
    public async Task<IActionResult> DownloadUsersCsv()
    {
        var users = await _auth.GetAllUsersForExportAsync();

        if (!users.Any())
            return NotFound(new APIResponse<string> { Success = false, Message = "No users to export." });

        var csv = new StringBuilder();

        // Add CSV headers with S.No
        csv.AppendLine("S.No,Email,FullName,PhoneNumber,CompanyName,Country,State,City");

        // Add user data with serial number
        int serial = 1;
        foreach (var u in users)
        {
            csv.AppendLine($"{serial},{u.Email},{u.FullName},{u.PhoneNumber},{u.CompanyName},{u.Country},{u.State},{u.City}");
            serial++;
        }

        var bytes = Encoding.UTF8.GetBytes(csv.ToString());

        // Return as CSV file
        return File(bytes, "text/csv", "RegisteredUsers.csv");
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        var res = await _auth.ForgotPasswordAsync(request);
        return Ok(res);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        var res = await _auth.ResetPasswordAsync(request);
        return Ok(res);
    }



}

using MarketPlace.Common.APIResponse;
using MarketPlace.Common.DTOs;
using MarketPlace.Common.DTOs.RequestModels;
using MarketPlace.Common.DTOs.ResponseModels;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Entities;
using System.Security.Claims;

namespace MarketPlace.Business.Services.Interface
{
    public interface IAuthService
    {
        Task<APIResponse<LoginResponse>> LoginAsync(LoginRequest request);
        Task<APIResponse<AuthDto>> CheckAuth(ClaimsPrincipal user);
        Task<APIResponse<LoginResponse>> RefreshTokenAsync();
        Task<APIResponse<string>> LogoutAsync();
        Task<APIResponse<string>> RegisterAsync(RegisterUser dto);
        Task<PagedData<RegisterUserResponce>> GetList(int page, int pageSize , string role);
        Task<List<RegisterUserResponce>> GetAllUsersForExportAsync();
        Task<APIResponse<string>> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<APIResponse<string>> ResetPasswordAsync(ResetPasswordRequest request);

    }
}

using MarketPlace.Common.DTOs.ResponseModels;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Entities;
namespace MarketPlace.Business.Services.Interface
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<User?> GetByRefreshTokenAsync(string refreshToken);
        Task SaveChangesAsync();
        void Add(User user);
        Task<User?> GetByPhoneNumberAsync(string phoneNumber);
        Task<PagedData<RegisterUserResponce>> GetList(int page, int pageSize , string role);
        Task<List<RegisterUserResponce>> GetAllForExportAsync();
        Task SetPasswordResetTokenAsync(User user, string token);
        Task<User?> GetByResetTokenAsync(string token);

    }
}

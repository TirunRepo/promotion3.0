using MarketPlace.Business.Services.Interface;
using MarketPlace.Common.DTOs;
using MarketPlace.Common.DTOs.ResponseModels;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarketPlace.Business.Services.Services
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _ctx;
        public UserRepository(AppDbContext ctx) => _ctx = ctx;

        public async Task<User?> GetByIdAsync(int id) => await _ctx.Users.FindAsync(id);

        public async Task<User?> GetByEmailAsync(string email) =>
            await _ctx.Users.FirstOrDefaultAsync(u => u.Email == email);

        public async Task<User?> GetByRefreshTokenAsync(string refreshToken) =>
            await _ctx.Users.FirstOrDefaultAsync(u => u.RefreshToken == refreshToken);

        public async Task SaveChangesAsync() => await _ctx.SaveChangesAsync();
        public void Add(User user) =>  _ctx.Users.Add(user);

        public async Task<User?> GetByPhoneNumberAsync(string phoneNumber) =>
            await _ctx.Users.FirstOrDefaultAsync(u => u.PhoneNumber == phoneNumber);


        public async Task<PagedData<RegisterUserResponce>> GetList(int page, int pageSize, string? role = null)
        {
            var usersQuery = _ctx.Users.AsQueryable();

            if (!string.IsNullOrWhiteSpace(role) && role.ToLower() != "null")
            {
                usersQuery = usersQuery.Where(u => u.Role.ToLower() == role.ToLower());
            }

            var totalCount = await usersQuery.CountAsync();

            var users = await usersQuery
                .OrderByDescending(u => u.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new RegisterUserResponce
                {
                    Id = u.Id,
                    Email = u.Email,
                    FullName = u.FullName,
                    PhoneNumber = u.PhoneNumber,
                    CompanyName = u.CompanyName,
                    Country = u.Country,
                    State = u.State,
                    City = u.City,
                    Role = u.Role
                })
                .ToListAsync();

            return new PagedData<RegisterUserResponce>
            {
                Items = users,
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }



        public async Task<List<RegisterUserResponce>> GetAllForExportAsync()
        {
            return await _ctx.Users
                .OrderBy(u => u.FullName) // Order by full name
                .Select(u => new RegisterUserResponce
                {
                    Id = u.Id,
                    Email = u.Email,
                    Role = u.Role,
                    FullName = u.FullName,
                    PhoneNumber = u.PhoneNumber,
                    CompanyName = u.CompanyName,
                    Country = u.Country,
                    State = u.State,
                    City = u.City
                })
                .ToListAsync();
        }

        public async Task SetPasswordResetTokenAsync(User user, string token)
        {
          user.PasswordResetToken = token;
          user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1);
           await _ctx.SaveChangesAsync();
        }

       public async Task<User?> GetByResetTokenAsync(string token)
       {
       return await _ctx.Users.FirstOrDefaultAsync(u =>
        u.PasswordResetToken == token && u.PasswordResetTokenExpiry > DateTime.UtcNow);
       }





    }
}

using MarketPlace.Common.CommonModel;
using MarketPlace.DataAccess.Entities.Promotions;

namespace MarketPlace.DataAccess.Repositories.Promotions.Interface
{
    public interface IPromotionRepository
    {
        Task<Entities.Promotions.Promotions> GetByIdAsync(int id);
        Task<List<Entities.Promotions.Promotions>> GetAllAsync();
        Task<Entities.Promotions.Promotions> AddAsync(Entities.Promotions.Promotions entity);
        Task<Entities.Promotions.Promotions> UpdateAsync(Entities.Promotions.Promotions entity);
        Task DeleteAsync(int id);
        Task<List<Entities.Promotions.Promotions>> GetActivePromotionsAsync(DateTime bookingDate);

        Task<List<IdNameValueModel<DateTime>>> GetSailDate();
        Task<List<IdNameModel<int>>> GetPromotionType();

        Task<List<IdNameModel<int>>> GetDestinationBySailDate(DateTime sailDate);

        Task<List<IdNameModel<int>>> GetCruiseLineBySailDate(DateTime sailDate);
        Task<List<IdNameModel<int>>> GetGroupIdBySailDate(DateTime sailDate);
    }
}

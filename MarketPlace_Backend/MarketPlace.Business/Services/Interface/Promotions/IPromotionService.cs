using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.RequestModels.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;

namespace MarketPlace.Business.Services.Interface.Promotions
{
    public interface IPromotionService
    {
        Task<PromotionResponse> CreateAsync(PromotionRequest promotion);
        Task<PromotionResponse> UpdateAsync(PromotionRequest promotion);
        Task DeleteAsync(int id);
        Task<PromotionResponse?> GetByIdAsync(int id);
        Task<List<PromotionResponse>> GetAllAsync();
        Task<List<PromotionCalculationResponse>> CalculateDiscountAsync(PromotionCalculationRequest request);

        Task<List<IdNameValueModel<DateTime>>> GetSailDate();
        Task<List<IdNameModel<int>>> GetPromotionType();

        Task<List<IdNameModel<int>>> GetDestinationBySailDate(DateTime sailDate);

        Task<List<IdNameModel<int>>> GetCruiseLineBySailDate(DateTime sailDate);
        Task<List<IdNameModel<int>>> GetGroupIdBySailDate(DateTime sailDate);
    }
}

using MarketPlace.Common.CommonModel;
using MarketPlace.DataAccess.Entities.Inventory;

namespace MarketPlace.Business.Repositories.Inventory.Interface
{
    public interface ICruisePromotionPricingRepository
    {
        public Task<CruisePromotionPricing> GetByIdAsync(int cruisePromotionPricingId);
        public Task<List<CruisePromotionPricing>> GetByCruiseInventoryAsync(int cruiseInventoryId);
        public Task<CruisePromotionPricing> InsertAsync(CruisePromotionPricing cruisePromotionPricing);
        public Task<CruisePromotionPricing> UpdateAsync(CruisePromotionPricing cruisePromotionPricing);
        public Task DeleteAsync(int cruisePromotionPricingId);
    }
}

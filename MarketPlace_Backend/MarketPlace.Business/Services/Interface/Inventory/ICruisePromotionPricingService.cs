using MarketPlace.DataAccess.Entities.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Interface.Inventory
{
    public interface ICruisePromotionPricingService
    {
        public Task<CruisePromotionPricing> GetByIdAsync(int cruisePromotionPricingId);
        public Task<List<CruisePromotionPricing>> GetByCruiseInventoryAsync(int cruiseInventoryId);
        public Task<CruisePromotionPricing> InsertAsync(CruisePromotionPricing cruisePromotionPricing);
        public Task<CruisePromotionPricing> UpdateAsync(CruisePromotionPricing cruisePromotionPricing);
        public Task DeleteAsync(int cruisePromotionPricingId);
    }
}

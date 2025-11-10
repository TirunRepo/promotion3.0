using MarketPlace.Business.Repositories.Inventory.Interface;
using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Repositories.Promotions.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Services.Inventory
{
    public class CruisePromotionPricingService : ICruisePromotionPricingService
    {
        private readonly ICruisePromotionPricingRepository _repository;
        public CruisePromotionPricingService(ICruisePromotionPricingRepository repository) 
        {
            _repository = repository;
        }
        public async Task<CruisePromotionPricing> GetByIdAsync(int cruisePromotionPricingId) 
        {
            return await _repository.GetByIdAsync(cruisePromotionPricingId);  
        }

        public async Task<List<CruisePromotionPricing>> GetByCruiseInventoryAsync(int cruiseInventoryId)
        {
            return await _repository.GetByCruiseInventoryAsync(cruiseInventoryId);
        }

        public async Task<CruisePromotionPricing> InsertAsync(CruisePromotionPricing cruisePromotionPricing)
        {
            return await _repository.InsertAsync(cruisePromotionPricing);
        }

        public async Task<CruisePromotionPricing> UpdateAsync(CruisePromotionPricing cruisePromotionPricing)
        {
            return await _repository.UpdateAsync(cruisePromotionPricing);
        }

        public async Task DeleteAsync(int cruisePromotionPricingId)
        {
            await _repository.DeleteAsync(cruisePromotionPricingId);
        }

        public async Task<int> GetCountByCruiseInventoryAsync(int cruiseInventoryId)
        {
            return await _repository.GetCountByCruiseInventoryAsync(cruiseInventoryId);
        }

    }
}

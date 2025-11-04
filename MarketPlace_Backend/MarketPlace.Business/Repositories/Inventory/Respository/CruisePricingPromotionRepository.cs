using MarketPlace.Business.Repositories.Inventory.Interface;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using Microsoft.EntityFrameworkCore;

namespace MarketPlace.Business.Repositories.Inventory.Respository
{
    public class CruisePricingPromotionRepository : ICruisePromotionPricingRepository
    {
        private readonly AppDbContext _context;
        public CruisePricingPromotionRepository(AppDbContext context) => _context = context;

        public async Task<CruisePromotionPricing> GetByIdAsync(int cruisePromotionPricingId) => await _context.CruisePromotionPricing.FindAsync(cruisePromotionPricingId);

        public async Task<List<CruisePromotionPricing>> GetByCruiseInventoryAsync(int cruiseInventoryId)
        {
             return await _context.CruisePromotionPricing
                .Where(x => x.CruiseInventoryId == cruiseInventoryId)
                .ToListAsync();
        }

        public async Task<CruisePromotionPricing> InsertAsync(CruisePromotionPricing cruisePromotionPricing) 
        {
            _context.CruisePromotionPricing.Add(cruisePromotionPricing);
            await _context.SaveChangesAsync();
            return cruisePromotionPricing;
        }

        public async Task<CruisePromotionPricing> UpdateAsync(CruisePromotionPricing cruisePromotionPricing)
        {
            _context.CruisePromotionPricing.Update(cruisePromotionPricing);
            await _context.SaveChangesAsync();
            return cruisePromotionPricing;
        }

        public async Task DeleteAsync(int cruisePromotionPricingId) 
        {
            var entity = await _context.CruisePromotionPricing.FindAsync(cruisePromotionPricingId);
            if (entity != null)
            {
                _context.CruisePromotionPricing.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    
    }
}

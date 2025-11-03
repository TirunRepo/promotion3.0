using AutoMapper;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using Microsoft.EntityFrameworkCore;

namespace MarketPlace.DataAccess.Repositories.Inventory.Respository
{
    public class CruisePricingRepository : ICruisePricingRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CruisePricingRepository(AppDbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<CruisePricingModel> Insert(CruisePricingModel model)
        {
            try
            {

                var entity = _mapper.Map<CruisePricing>(model);


                _context.CruisePricing.Add(entity);
                await _context.SaveChangesAsync();

                return _mapper.Map<CruisePricingModel>(entity);
            }
            catch (DbUpdateException dbEx)
            {
                // Log or inspect dbEx.InnerException.Message for more details
                throw new Exception($"DB Update failed: {dbEx.InnerException?.Message ?? dbEx.Message}", dbEx);
            }
        }

        public async Task<CruisePricingModel> Update(CruisePricing model)
        {
            try
            {

                var entity = _mapper.Map<CruisePricing>(model);


                _context.CruisePricing.Update(entity);
                await _context.SaveChangesAsync();

                return _mapper.Map<CruisePricingModel>(entity);
            }
            catch (DbUpdateException dbEx)
            {
                // Log or inspect dbEx.InnerException.Message for more details
                throw new Exception($"DB Update failed: {dbEx.InnerException?.Message ?? dbEx.Message}", dbEx);
            }
        }
        public async Task<List<CruisePricingResponse>> GetByInventoryIdsAsync(List<int> inventoryIds)
        {
            var pricing =  await _context.CruisePricing
                .Where(x => inventoryIds.Contains(x.CruiseInventoryId))
                .ToListAsync();

            return _mapper.Map<List<CruisePricingResponse>>(pricing);

        }
        public async Task<CruisePricing?> GetByInventoryIdAsync(int? id)
        {
            var pricing =  await _context.CruisePricing
                .Where(x => id == x.CruiseInventoryId)
                .ToListAsync();

            return pricing.FirstOrDefault();

        }
    }
}

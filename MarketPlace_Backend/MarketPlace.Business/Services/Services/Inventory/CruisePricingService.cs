using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using MarketPlace.DataAccess.Repositories.Inventory.Respository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Services.Inventory
{
    public class CruisePricingService : ICruisePricingService
    {
        private readonly ICruisePricingRepository _CruisePricingRepository;

        public CruisePricingService(ICruisePricingRepository CruisePricingCabinRepository)
        {
            _CruisePricingRepository = CruisePricingCabinRepository ?? throw new ArgumentNullException(nameof(CruisePricingCabinRepository));
        }

        public async Task<CruisePricingModel> Insert(CruisePricingModel model)
        {
                CruisePricingModel cruiseCabinPricingModel = new()
                {
                  
                    PricingType = model.PricingType,
                    CommisionRate = model.CommisionRate,
                    SinglePrice = model.SinglePrice,
                    DoublePrice = model.DoublePrice,
                    TriplePrice = model.TriplePrice,
                    Tax = model.Tax,
                    Nccf = model.Nccf,
                    CruiseInventoryId = model.CruiseInventoryId,
                    Grats = model.Grats,
                    CreatedBy = model.CreatedBy,
                    CreatedOn = model.CreatedOn ,
                    CurrencyType = model.CurrencyType,
                    CabinOccupancy = model.CabinOccupancy,

                };
                 return await _CruisePricingRepository.Insert(cruiseCabinPricingModel);
        }

        public async Task<CruisePricingModel> Update(int id, CruisePricingModel model)
        {
            try
            {
                // Get the existing entity from the repository/DB
                var pricing = await _CruisePricingRepository.GetByInventoryIdAsync(id);
                if (pricing == null)
                {
                    throw new KeyNotFoundException($"CruiseInventory with Id {id} not found.");
                }

                // Update properties
                pricing.CabinOccupancy = model.CabinOccupancy;
                pricing.Nccf = model.Nccf;
                pricing.SinglePrice = model.SinglePrice;
                pricing.DoublePrice = model.DoublePrice;
                pricing.TriplePrice = model.TriplePrice;
                pricing.CruiseInventoryId = model.CruiseInventoryId;
                pricing.CurrencyType = model.CurrencyType;
                pricing.Grats = model.Grats;
                pricing.Tax = model.Tax;
                pricing.UpdatedBy = model.UpdatedBy;
                pricing.UpdatedOn = model.UpdatedOn;

                // Persist changes through repository
                return await _CruisePricingRepository.Update(pricing);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating CruiseInventory with Id {id}: {ex.Message}", ex);
            }
        }

        public async Task<List<CruisePricingResponse>> GetByInventoryIdsAsync(List<int> inventoryIds)
        {
            return await _CruisePricingRepository.GetByInventoryIdsAsync(inventoryIds);
        }

    }
}

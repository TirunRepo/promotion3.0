using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Entities.Inventory;


namespace MarketPlace.DataAccess.Repositories.Inventory.Interface
{
    public interface ICruisePricingRepository
    {
        Task<CruisePricingModel> Insert(CruisePricingModel model);
        Task<CruisePricingModel> Update(CruisePricing model);

        Task<List<CruisePricingResponse>> GetByInventoryIdsAsync(List<int> inventoryIds);
        Task<CruisePricing?> GetByInventoryIdAsync(int? inventoryIds);

    }
}

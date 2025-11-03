using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Interface.Inventory
{
    public interface ICruisePricingService
    {
        Task<CruisePricingModel> Insert(CruisePricingModel model);
        Task<CruisePricingModel> Update(int id,CruisePricingModel model);
        Task<List<CruisePricingResponse>> GetByInventoryIdsAsync(List<int> inventoryIds);

    }
}

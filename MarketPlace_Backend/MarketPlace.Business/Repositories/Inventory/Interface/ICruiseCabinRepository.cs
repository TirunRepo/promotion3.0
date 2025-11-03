using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.DataAccess.Entities.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Repositories.Inventory.Interface
{
    public interface ICruiseCabinRepository
    {
        Task<CruiseCabinRequest> Insert(CruiseCabinRequest cabinDtos);
        Task<CruiseCabinRequest> Update(CruiseCabinResponse model);

        Task<CruiseCabinRequest> Remove(CruiseCabinResponse? cabinDtos);

        Task<bool> Delete(int id);

        Task<List<CruiseCabinResponse>> GetByInventoryIdsAsync(List<int> id);

    }
}

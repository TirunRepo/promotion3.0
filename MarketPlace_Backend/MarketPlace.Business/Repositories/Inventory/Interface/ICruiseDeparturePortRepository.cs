using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Entities.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.DataAccess.Repositories.Inventory.Interface
{
    public interface ICruiseDeparturePortRepository
    {
        Task<DeparturePortRequest> Insert(DeparturePortRequest model);
        Task<DeparturePortRequest> Update(int Id, DeparturePortRequest model);
        Task<bool> Delete(int id);
        Task<PagedData<CruiseDeparturePortResponse>> GetList(int page, int pageSize);

        Task<CruiseDeparturePortResponse> GetById(int id);
    }
}

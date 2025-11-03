using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Entities.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Interface.Inventory
{
    public interface ICruiseShipService
    {
        Task<PagedData<CruiseShipReponse>> GetList(int page, int pageSize);
        Task<CruiseShipReponse> GetById(int id);
        Task<CruiseShipRequest> Insert(CruiseShipRequest cruiseShipDto);
        Task<CruiseShipRequest> Update(int Id,CruiseShipRequest cruiseShipDto);
        Task<bool> Delete(int id);
    }
}

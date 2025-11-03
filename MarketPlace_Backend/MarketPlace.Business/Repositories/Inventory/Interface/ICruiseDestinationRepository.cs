using MarketPlace.Common.CommonModel;
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
    public interface ICruiseDestinationRepository
    {
        Task<DestinationRequest> Insert(DestinationRequest model);
        Task<DestinationRequest> Update(int Id, DestinationRequest model);
        Task<bool> Delete(int id);
        Task<PagedData<DestinationResponse>> GetList(int page, int pageSize);
        Task<DestinationResponse> GetById(int id);
        Task<List<IdNameModel<int>>> Get();


    }
}

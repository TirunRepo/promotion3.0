using MarketPlace.Common.CommonModel;
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
    public interface IDestinationService
    {
        Task<List<IdNameModel<int>>> Get();
        Task<PagedData<DestinationResponse>> GetList(int page, int pageSize);
        Task<DestinationResponse> GetById(int id);
        Task<DestinationRequest> Insert(DestinationRequest portDto);
        Task<DestinationRequest> Update(int Id, DestinationRequest portDto);
        Task<bool> Delete(int id);
    }
}

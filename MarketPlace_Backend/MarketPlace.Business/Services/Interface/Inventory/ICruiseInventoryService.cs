using MarketPlace.Common.APIResponse;
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
    public interface ICruiseInventoryService
    {
        Task<CruiseInventoryModel> Insert(CruiseInventoryRequest model);
        Task<CruiseInventoryModel> Update(int id , CruiseInventoryRequest model);
        Task<PagedData<CruiseInventoryResponse>> GetList(int page, int pageSize, string role, int? userId);
        Task<CruiseInventoryModel> UpdateRoles(InventoryRoleUpdateRequest model);
        Task<PagedData<AgentInventoryReport>> GetAgentInventoryReportAsync(int agentId, int page, int pageSize);


    }
}

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
    public interface ICruiseInventoryRepository
    {
        Task<CruiseInventoryModel> Insert(CruiseInventoryModel cruiseInventoryDto);
        Task<CruiseInventoryModel> Update(CruiseInventory cruiseInventoryDto);
        Task<CruiseInventory?> GetByIdAsync(int id);
        Task<PagedData<CruiseInventory>> GetPagedAsync(int page, int pageSize, string role, int? userId);
        Task<CruiseInventoryModel> UpdateRoles(InventoryRoleUpdateRequest roleInventoryUpdateRequest);
        Task<PagedData<AgentInventoryReport>> GetAgentInventoryReportAsync(int agentId, int page, int pageSize);


    }
}

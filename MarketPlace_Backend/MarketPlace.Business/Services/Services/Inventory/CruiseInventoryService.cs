using AutoMapper;
using MarketPlace.Business.Repositories.Inventory.Interface;
using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Common.APIResponse;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using MarketPlace.DataAccess.Repositories.Inventory.Respository;

namespace MarketPlace.Business.Services.Services.Inventory
{
    public class CruiseInventoryService : ICruiseInventoryService
    {
        private readonly ICruiseInventoryRepository _cruiseInventoryRepository;
        private readonly ICruisePricingRepository _cruisePricingRepository;
        public readonly ICruiseCabinRepository _cruiseCabinRepository;
        public readonly ICruisePromotionPricingRepository _cruisePromotionPricingRepository;
        private readonly IMapper _mapper;
        private readonly ICruiseDeckImageRepository _cruiseDeckImageRepository;



        public CruiseInventoryService(ICruiseInventoryRepository cruiseInventoryRepository,ICruisePricingRepository cruisePricingRepository, ICruiseCabinRepository cruiseCabinRepository, ICruiseDeckImageRepository cruiseDeckImageRepository, IMapper mapper, ICruisePromotionPricingRepository cruisePromotionPricingRepository)
        {
            _cruiseInventoryRepository = cruiseInventoryRepository ?? throw new ArgumentNullException(nameof(cruiseInventoryRepository));
            _cruisePricingRepository = cruisePricingRepository;
            _cruiseCabinRepository = cruiseCabinRepository;
            _cruiseDeckImageRepository = cruiseDeckImageRepository;
            _cruisePromotionPricingRepository = cruisePromotionPricingRepository;
            _mapper = mapper;
        }
        public async Task<CruiseInventoryModel> Insert(CruiseInventoryRequest model) 
        {
            try
            {

                CruiseInventoryModel inventoryModel = new()
                {
                    SailDate = model.SailDate,
                    CategoryId = model.CategoryId,
                    GroupId = model.GroupId,
                    Nights = model.Nights,
                    Deck  = model.Deck,
                    Package = model.Package,
                    ShipCode = model.ShipCode,
                    Stateroom = model.Stateroom,
                    CruiseLineId = model.CruiseLineId,
                    CruiseShipId = model.CruiseShipId,
                    DeparturePortId = model.DeparturePortId,
                    DestinationId = model.DestinationId,
                    EnableAdmin = model.EnableAdmin,
                    EnableAgent = model.EnableAgent,
                    CreatedBy = model.CreatedBy,
                    CreatedOn = model.CreatedOn             
                };

                return await _cruiseInventoryRepository.Insert(inventoryModel);
            }
            catch (Exception ex) 
            {
                throw new Exception(ex.Message);
            }
        }
        public async Task<CruiseInventoryModel> Update(int id, CruiseInventoryRequest model)
        {
            try
            {
                // Get the existing entity from the repository/DB
                var inventory = await _cruiseInventoryRepository.GetByIdAsync(id);
                if (inventory == null)
                {
                    throw new KeyNotFoundException($"CruiseInventory with Id {id} not found.");
                }

                // Update properties
                inventory.SailDate = model.SailDate;
                inventory.CategoryId = model.CategoryId;
                inventory.GroupId = model.GroupId;
                inventory.Nights = model.Nights;
                inventory.Deck = model.Deck;
                inventory.Package = model.Package;
                inventory.ShipCode = model.ShipCode;
                inventory.Stateroom = model.Stateroom;
                inventory.CruiseLineId = model.CruiseLineId;
                inventory.CruiseShipId = model.CruiseShipId;
                inventory.DeparturePortId = model.DeparturePortId;
                inventory.DestinationId = model.DestinationId;
                inventory.EnableAdmin = model.EnableAdmin;
                inventory.EnableAgent = model.EnableAgent;

                // Audit fields
                inventory.UpdatedBy = model.UpdatedBy;
                inventory.UpdatedOn = DateTime.UtcNow;

                // Persist changes through repository
                return await _cruiseInventoryRepository.Update(inventory);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating CruiseInventory with Id {id}: {ex.Message}", ex);
            }
        }

        public async Task<PagedData<CruiseInventoryResponse>> GetList(int page, int pageSize,string role, int? userId)
        {
            var inventories = await _cruiseInventoryRepository.GetPagedAsync(page, pageSize, role, userId);

            var inventoryIds = inventories.Items.Select(x => x.Id).ToList();

            var pricingList = await _cruisePricingRepository.GetByInventoryIdsAsync(inventoryIds);
            var cabinList = await _cruiseCabinRepository.GetByInventoryIdsAsync(inventoryIds);

            var pricingDict = pricingList.ToDictionary(p => p.CruiseInventoryId);
            var cabinDict = cabinList
                .GroupBy(c => c.CruiseInventoryId)
                .ToDictionary(g => g.Key, g => _mapper.Map<List<CruiseCabinResponse>>(g.ToList()));

            var responseList = new List<CruiseInventoryResponse>();

            foreach (var inventory in inventories.Items)
            {
                var response = _mapper.Map<CruiseInventoryResponse>(inventory);

                if (pricingDict.TryGetValue(inventory.Id, out var pricing))
                {
                    _mapper.Map(pricing, response);
                }

                response.AppliedPromotionCount = await _cruisePromotionPricingRepository.GetCountByCruiseInventoryAsync(inventory.Id);

                if (cabinDict.TryGetValue(inventory.Id, out var cabins))
                {
                    response.CabinDetails = cabins.Select(c => new MarketPlace.Common.DTOs.ResponseModels.Inventory.CabinDetails
                    {
                        CabinNo = c.CabinNo,
                        CabinOccupancy = c.CabinOccupancy,
                        CabinType = c.CabinType
                    }).ToList();

                }

                responseList.Add(response);
            }

            return new PagedData<CruiseInventoryResponse>
            {
                Items = responseList,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(inventories.TotalCount / (double)pageSize)
            };
        }


        public async Task<CruiseInventoryModel> UpdateRoles(InventoryRoleUpdateRequest model)
        {
            // Optional: get UpdatedBy from model or claims if needed
            int? updatedBy = null;

            // Role-based logic example
            if (model.UserRole.Equals("Agent", System.StringComparison.OrdinalIgnoreCase))
            {
                model.EnableAdmin = false; // Agents cannot change EnableAdmin
            }

            // Call repository to update flags
            return await _cruiseInventoryRepository.UpdateRoles(model);
        }

        public async Task<PagedData<AgentInventoryReport>> GetAgentInventoryReportAsync(int agentId, int page, int pageSize)
        {
            return await _cruiseInventoryRepository.GetAgentInventoryReportAsync(agentId, page, pageSize);
        }



    }
}

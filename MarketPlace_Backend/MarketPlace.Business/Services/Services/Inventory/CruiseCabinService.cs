using MarketPlace.Business.Repositories.Inventory.Interface;
using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using MarketPlace.DataAccess.Repositories.Inventory.Respository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Services.Inventory
{
    public class CruiseCabinService : ICruiseCabinService
    {
        private readonly ICruiseCabinRepository _cruiseCabinRepositiry;
        private readonly AppDbContext _context;

        public CruiseCabinService(ICruiseCabinRepository cruiseCabinRepository,AppDbContext context)
        {
            _cruiseCabinRepositiry = cruiseCabinRepository ?? throw new ArgumentNullException(nameof(cruiseCabinRepository));
            _context = context;
        }


        public async Task<List<CruiseCabinRequest>> Insert(List<CruiseCabinRequest> model)
        {
            List<CruiseCabinRequest> cruiseCabinRequests = new List<CruiseCabinRequest>();

            foreach (var cabin in model)
            {
                // Handle GTY cabin types
                if (cabin.CabinType.Equals("Gty", StringComparison.OrdinalIgnoreCase) && int.TryParse(cabin.CabinNo, out int gtyCabinCount))
                {
                    int cabinIndex = 1;
                    int addedCount = 0;

                    while (addedCount < gtyCabinCount)
                    {
                        string gtyCabinNo = "GTY" + cabinIndex;
                        bool isRecordExist = _context.CruiseCabin
                            .Any(x => x.CabinNo == gtyCabinNo && x.CabinType.ToUpper() == "GTY");

                        if (!isRecordExist)
                        {
                            var cruiseCabinModel = new CruiseCabinRequest
                            {
                                CabinNo = gtyCabinNo,
                                CabinOccupancy = cabin.CabinOccupancy,
                                CabinType = cabin.CabinType,
                                CruiseInventoryId = cabin.CruiseInventoryId,
                                CreatedBy = model.First().CreatedBy,
                                CreatedOn = model.First().CreatedOn
                            };

                            cruiseCabinRequests.Add(await _cruiseCabinRepositiry.Insert(cruiseCabinModel));
                            addedCount++;
                        }

                        cabinIndex++;
                    }
                }
                else
                {
                    // Handle regular (non-GTY) cabin types
                    var cruiseCabinModel = new CruiseCabinRequest
                    {
                        CabinNo = cabin.CabinNo,
                        CabinOccupancy = cabin.CabinOccupancy,
                        CabinType = cabin.CabinType,
                        CruiseInventoryId = cabin.CruiseInventoryId,
                        CreatedBy = model.First().CreatedBy,
                        CreatedOn = model.First().CreatedOn
                    };

                    cruiseCabinRequests.Add(await _cruiseCabinRepositiry.Insert(cruiseCabinModel));
                }
            }

            return cruiseCabinRequests;
        }

        public async Task<List<CruiseCabinRequest>> Update(int inventoryId, List<CruiseCabinRequest> model)
        {
            var updatedCabins = new List<CruiseCabinRequest>();

            // Get existing cabins from DB
            var existingCabins = await _cruiseCabinRepositiry.GetByInventoryIdsAsync(new List<int> { inventoryId });
            var existingDict = existingCabins.ToDictionary(c => c.CabinNo, StringComparer.OrdinalIgnoreCase);

            // Handle deletions first
            foreach (var existing in existingCabins)
            {
                var incoming = model.FirstOrDefault(m => m.CabinNo.Equals(existing.CabinNo, StringComparison.OrdinalIgnoreCase));
                if (incoming == null || incoming.IsRemoveCabin)
                {
                    // Delete individually
                    await _cruiseCabinRepositiry.Delete(existing.Id);
                }
            }

            // Handle updates / inserts
            foreach (var cabin in model)
            {
                // Skip cabins marked for removal
                if (cabin.IsRemoveCabin) continue;

                if (cabin.CabinType.Equals("Gty", StringComparison.OrdinalIgnoreCase) &&
                    int.TryParse(cabin.CabinNo, out int gtyCount))
                {
                    for (int i = 1; i <= gtyCount; i++)
                    {
                        string gtyCabinNo = $"GTY{i}";
                        if (existingDict.TryGetValue(gtyCabinNo, out var existing))
                        {
                            // Update existing GTY cabin
                            existing.CabinOccupancy = cabin.CabinOccupancy;
                            existing.CabinType = "GTY";
                            existing.UpdatedBy = cabin.UpdatedBy;
                            existing.UpdatedOn = DateTime.UtcNow;

                            updatedCabins.Add(await _cruiseCabinRepositiry.Update(existing));
                        }
                        else
                        {
                            // Insert new GTY cabin
                            var newCabin = new CruiseCabinRequest
                            {
                                CruiseInventoryId = inventoryId,
                                CabinNo = gtyCabinNo,
                                CabinType = "GTY",
                                CabinOccupancy = cabin.CabinOccupancy,
                                CreatedBy = cabin.UpdatedBy,
                                CreatedOn = DateTime.UtcNow
                            };
                            updatedCabins.Add(await _cruiseCabinRepositiry.Insert(newCabin));
                        }
                    }
                }
                else
                {
                    if (existingDict.TryGetValue(cabin.CabinNo, out var existing))
                    {
                        // Update existing
                        existing.CabinOccupancy = cabin.CabinOccupancy;
                        existing.CabinType = cabin.CabinType;
                        existing.UpdatedBy = cabin.UpdatedBy;
                        existing.UpdatedOn = DateTime.UtcNow;

                        updatedCabins.Add(await _cruiseCabinRepositiry.Update(existing));
                    }
                    else
                    {
                        // Insert new
                        var newCabin = new CruiseCabinRequest
                        {
                            CruiseInventoryId = inventoryId,
                            CabinNo = cabin.CabinNo,
                            CabinType = cabin.CabinType,
                            CabinOccupancy = cabin.CabinOccupancy,
                            CreatedBy = cabin.UpdatedBy,
                            CreatedOn = DateTime.UtcNow
                        };
                        updatedCabins.Add(await _cruiseCabinRepositiry.Insert(newCabin));
                    }
                }
            }

            return updatedCabins;
        }

        public async Task<List<CruiseCabinResponse>> GetByInventoryIdsAsync(List<int> inventoryIds)
        {
            return await _cruiseCabinRepositiry.GetByInventoryIdsAsync(inventoryIds);
        }

    }
}

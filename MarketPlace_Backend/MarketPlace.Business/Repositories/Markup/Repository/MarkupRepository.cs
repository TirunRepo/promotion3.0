using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Entities.Markup;
using MarketPlace.DataAccess.Repositories.Markup.Interface;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace MarketPlace.DataAccess.Repositories.Markup.Repository
{
    public class MarkupRepository : IMarkupRepository
    {
        private readonly AppDbContext _context;
        public MarkupRepository(AppDbContext context) => _context = context;
        public async Task<MarkupDetail> AddAsync(MarkupDetail entity)
        {
            _context.MarkupDetails.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task DeleteAsync(int id)
        {
            var entity = await _context.MarkupDetails.FindAsync(id);
            if (entity != null)
            {
                _context.MarkupDetails.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<MarkupResponse>> GetMarkupDetails()
        {
            var data = await (
                from m in _context.MarkupDetails
                join i in _context.CruiseInventories on m.GroupId equals i.GroupId
                join u in _context.Users on i.CreatedBy equals u.Id into userJoin
                from u in userJoin.DefaultIfEmpty()
                select new MarkupResponse
                {
                    Id = m.Id,
                    SailDate = m.SailDate,
                    GroupId = m.GroupId,
                    CategoryId = m.CategoryId,
                    CabinOccupancy = m.CabinOccupancy,
                    BaseFare = m.BaseFare,
                    MarkupMode = m.MarkupMode,
                    MarkUpPercentage = m.MarkUpPercentage,
                    MarkUpFlatAmount = m.MarkUpFlatAmount,
                    CalculatedFare = m.CalculatedFare,
                    IsActive = m.IsActive,
                    InventoryId = i.Id,
                    AgentName = u.CompanyName
                }
            ).ToListAsync();

            return data;
        }


        public async Task<MarkupDetail> UpdateAsync(MarkupDetail entity)
        {
            _context.MarkupDetails.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<MarkupDetail> GetByIdAsync(int id) => await _context.MarkupDetails.FindAsync(id);

        public async Task<List<IdNameValueModel<DateTime>>> GetSailDate()
        {
            var sailDate = await _context.CruiseInventories.Where(x => x.EnableAdmin).Select(x => new IdNameValueModel<DateTime>
            {
                Id = x.Id,
                Name = x.Package,
                Value = x.SailDate
            }).ToListAsync();

            return sailDate;
        }

        public async Task<List<IdNameModel<int>>> GetGroupId(DateTime saildate)
        {
            var groupId = await _context.CruiseInventories.Where(x => x.SailDate == saildate).Select(x => new IdNameModel<int>
            {
                Id = x.Id,
                Name = x.GroupId
            }).ToListAsync();

            return groupId;
            
        }
        public async Task<List<IdNameModel<int>>> GetCategoryId(DateTime saildate,string groupId)
        {
            var catId = await _context.CruiseInventories.Where(x => x.SailDate == saildate && x.GroupId == groupId).Select(x => new IdNameModel<int>
            {
                Id = x.Id,
                Name = x.GroupId
            }).ToListAsync();

            return catId;
        }

        public async Task<MarkUpCabinOccupancyModel> GetCabinOccupancy(int id)
        {
            var cabinOccupany = await _context.CruisePricing.Where(x => x.CruiseInventoryId == id).Select(x => new MarkUpCabinOccupancyModel
            {
                CabinOccupancy = x.CabinOccupancy,
                SingleRate = x.CommisionSingleRate != null || x.CommisionSingleRate != 0 ? x.CommisionSingleRate : x.SinglePrice,
                DoubleRate =   x.CommisionDoubleRate != null || x.CommisionDoubleRate != 0 ? x.CommisionDoubleRate : x.DoublePrice,
                TripleRate =   x.CommisionTripleRate != null || x.CommisionTripleRate != 0 ? x.CommisionTripleRate : x.TriplePrice, 
                Tax = x.Tax,
                Grats = x.Grats,
                Nccf = x.Nccf,
            }).FirstAsync();

            return cabinOccupany;
        }

        public async Task<PromotiosDetailsModel> GetPromotionDetails(DateTime sailDate, string groupId, int destinationId, int cruiseLineId)
        {
            var promotion = await _context.Promotions
                   .Where(p => p.SailDate == sailDate
                               && p.GroupId == groupId
                               && p.DestinationId == destinationId
                               && p.CruiseLineId == cruiseLineId)
                   .FirstOrDefaultAsync();

            if (promotion == null)
                return null;

            var details = new PromotiosDetailsModel
            {
                DiscountAmount = promotion.DiscountAmount,
                DiscountPercentage = promotion.DiscountPer,
                PromotionName = promotion.PromotionName
            };

            return details; 
                
        }

        public async Task<ShipDetailsModel> GetShipDetails(int id)
        {
            var cruiseInventory = await _context.CruiseInventories.FindAsync(id);
            var ship = await _context.CruiseShips.FindAsync(cruiseInventory.CruiseShipId);
            var cruiseLine = await _context.CruiseLines.FindAsync(cruiseInventory.CruiseLineId);
            var destination = await _context.Destinations.FindAsync(cruiseInventory.DestinationId);

            var shipDetails = new ShipDetailsModel()
            {
                CruiseLine = new IdNameModel<int>() { Id =cruiseLine.Id, Name = cruiseLine.Name },
                Destination = new IdNameModel<int> { Id = destination.Id, Name = destination.Name },
                Ship = new IdNameModel<int> { Id = ship.Id, Name = ship.Name }
            };
            return shipDetails;
        }

        public async Task<bool> CheckDuplicateMarkup(DateTime sailDate, string groupId, string categoryId, string cabinOccupancy)
        {
            return await _context.MarkupDetails.AnyAsync(x =>
                x.SailDate == sailDate &&
                x.GroupId == groupId &&
                x.CategoryId == categoryId &&
                x.CabinOccupancy == cabinOccupancy
            );
        }

    }
}

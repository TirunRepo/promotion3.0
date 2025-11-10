using MarketPlace.Common.CommonModel;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Promotions;
using MarketPlace.DataAccess.Repositories.Promotions.Interface;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace MarketPlace.DataAccess.Repositories.Promotions.Repository
{
    public class PromotionRepository : IPromotionRepository
    {
        private readonly AppDbContext _context;
        public PromotionRepository(AppDbContext context) => _context = context;

        public async Task<Entities.Promotions.Promotions> GetByIdAsync(int id) => await _context.Promotions.FindAsync(id);
        public async Task<List<Entities.Promotions.Promotions>> GetAllAsync()
        {
            return await _context.Set<Entities.Promotions.Promotions>()
                .Select(x => new Entities.Promotions.Promotions()
                {
                    AffiliateName = x.AffiliateName,
                    CabinCountRequired = x.CabinCountRequired,
                    DiscountAmount = x.DiscountAmount,
                    DiscountPer = x.DiscountPer,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    FreeNthPassenger = x.FreeNthPassenger,
                    Id = x.Id,
                    IncludesAirfare = x.IncludesAirfare,
                    IncludesHotel = x.IncludesHotel,
                    IncludesShoreExcursion = x.IncludesShoreExcursion,
                    IncludesWiFi = x.IncludesWiFi,
                    IsActive = x.IsActive,
                    IsAdultTicketDiscount = x.IsAdultTicketDiscount,
                    IsChildTicketDiscount = x.IsChildTicketDiscount,
                    IsFirstTimeCustomer = x.IsFirstTimeCustomer,
                    IsStackable = x.IsStackable,
                    LoyaltyLevel = x.LoyaltyLevel,
                    MaxPassengerAge = x.MaxPassengerAge,
                    MinNoOfAdultRequired = x.MinNoOfAdultRequired,
                    MinNoOfChildRequired = x.MinNoOfChildRequired,
                    MinPassengerAge = x.MinPassengerAge,
                    OnboardCreditAmount = x.OnboardCreditAmount,
                    PassengerType = x.PassengerType,
                    PromoCode = x.PromoCode,
                    PromotionDescription = x.PromotionDescription,
                    PromotionName = x.PromotionName,
                    PromotionTypeId = x.PromotionTypeId,
                    SailDate = x.SailDate,
                    DestinationId = x.DestinationId,
                    CruiseLineId = x.CruiseLineId,
                    CruiseShipId = x.CruiseShipId,
                    CalculatedOn = x.CalculatedOn,
                    DiscountType = x.DiscountType,
                    IsBOGO = x.IsBOGO
                })
                .ToListAsync();
        }
        public async Task<Entities.Promotions.Promotions> AddAsync(Entities.Promotions.Promotions entity)
        {
            _context.Promotions.Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        public async Task<Entities.Promotions.Promotions> UpdateAsync(Entities.Promotions.Promotions entity)
        {
            _context.Promotions.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        public async Task DeleteAsync(int id)
        {
            var entity = await _context.Promotions.FindAsync(id);
            if (entity != null)
            {
                _context.Promotions.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<Entities.Promotions.Promotions>> GetActivePromotionsAsync(DateTime bookingDate)
        {
            return await _context.Set<Entities.Promotions.Promotions>()
                .Where(p => p.IsActive &&
                            p.StartDate.Date <= bookingDate.Date &&
                            p.EndDate.Date >= bookingDate.Date)
                .Select(x => new Entities.Promotions.Promotions()
                {
                    AffiliateName = x.AffiliateName,
                    CabinCountRequired = x.CabinCountRequired,
                    DiscountAmount = x.DiscountAmount,
                    DiscountPer = x.DiscountPer,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    FreeNthPassenger = x.FreeNthPassenger,
                    Id = x.Id,
                    IncludesAirfare = x.IncludesAirfare,
                    IncludesHotel = x.IncludesHotel,
                    IncludesShoreExcursion = x.IncludesShoreExcursion,
                    IncludesWiFi = x.IncludesWiFi,
                    IsActive = x.IsActive,
                    IsAdultTicketDiscount = x.IsAdultTicketDiscount,
                    IsChildTicketDiscount = x.IsChildTicketDiscount,
                    IsFirstTimeCustomer = x.IsFirstTimeCustomer,
                    IsStackable = x.IsStackable,
                    LoyaltyLevel = x.LoyaltyLevel,
                    MaxPassengerAge = x.MaxPassengerAge,
                    MinNoOfAdultRequired = x.MinNoOfAdultRequired,
                    MinNoOfChildRequired = x.MinNoOfChildRequired,
                    MinPassengerAge = x.MinPassengerAge,
                    OnboardCreditAmount = x.OnboardCreditAmount,
                    PassengerType = x.PassengerType,
                    PromoCode = x.PromoCode,
                    PromotionDescription = x.PromotionDescription,
                    PromotionName = x.PromotionName,
                    PromotionTypeId = x.PromotionTypeId,
                    SailDate = x.SailDate,
                })
                .ToListAsync();
        }

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
        public async Task<List<IdNameModel<int>>> GetPromotionType()
        {
            var promotionType = await _context.PromotionType.Select(x => new IdNameModel<int>
            {
                Id = x.Id,
                Name = x.Name,
            }).ToListAsync();

            return promotionType;
        }

        public async Task<List<IdNameModel<int>>> GetDestinationBySailDate(DateTime sailDate)
        {

            var destination = await _context.CruiseInventories.Where(x => x.SailDate == sailDate).Select(x => x.DestinationId).ToListAsync();

            var destinationList = await _context.Destinations.Where(x => destination.Contains(x.Id)).Select(x => new IdNameModel<int>
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync();
            return destinationList;

        }
        public async Task<List<IdNameModel<int>>> GetCruiseLineBySailDate(DateTime sailDate)
        {

            var cruiseLine = await _context.CruiseInventories.Where(x => x.SailDate == sailDate).Select(x => x.CruiseLineId).ToListAsync();

            var list = await _context.CruiseLines.Where(x => cruiseLine.Contains(x.Id)).Select(x => new IdNameModel<int>
            {
                Id = x.Id,
                Name = x.Name
            }).ToListAsync();
            return list;

        }
        public async Task<List<IdNameModel<int>>> GetGroupIdBySailDate(DateTime sailDate)
        {

            var cruiseLine = await _context.CruiseInventories.Where(x => x.SailDate == sailDate).Select(x => new IdNameModel<int>
            {
                Id = x.Id,
                Name = x.GroupId
            }).ToListAsync();
            return cruiseLine;

        }


    }
}
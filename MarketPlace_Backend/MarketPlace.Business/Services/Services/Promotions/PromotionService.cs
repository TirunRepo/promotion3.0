using AutoMapper;
using MarketPlace.Business.Services.Interface.Promotions;
using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.RequestModels.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MarketPlace.Common.Types.Promotion;
using MarketPlace.DataAccess.Entities.Promotions;
using MarketPlace.DataAccess.Repositories.Promotions.Interface;

namespace MarketPlace.Business.Services.Services.Promotions
{
    public class PromotionService : IPromotionService
    {
        private readonly IPromotionRepository _repository;
        private readonly IMapper _mapper;

        public PromotionService(IPromotionRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<PromotionResponse> CreateAsync(PromotionRequest promotion)
        {
            var entity = _mapper.Map<DataAccess.Entities.Promotions.Promotions>(promotion);
            promotion.IsActive = true;
            var created = await _repository.AddAsync(entity);
            return _mapper.Map<PromotionResponse>(created);
        }

        public async Task<PromotionResponse> UpdateAsync(PromotionRequest promotion)
        {
            var entity = _mapper.Map<DataAccess.Entities.Promotions.Promotions>(promotion);
            var updated = await _repository.UpdateAsync(entity);
            return _mapper.Map<PromotionResponse>(updated);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        public async Task<PromotionResponse?> GetByIdAsync(int id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity == null ? null : _mapper.Map<PromotionResponse>(entity);
        }

        public async Task<List<PromotionResponse>> GetAllAsync()
        {
            var list = await _repository.GetAllAsync();
            var response = _mapper.Map<List<PromotionResponse>>(list);
            foreach (var item in response)
            {
                item.PromotionType = ((PromotionCalculationType)item.PromotionTypeId).ToString();
            }
            return response;
        }

        public async Task<List<PromotionCalculationResponse>> CalculateDiscountAsync(PromotionCalculationRequest request)
        {
            var promotions = await _repository.GetActivePromotionsAsync(request.BookingDate);

            var filteredPromotions = promotions.ToList();

            var flatDiscountTypePromotions = GetFilteredRecords(filteredPromotions, PromotionCalculationType.FlatDiscount);

            List<PromotionCalculationResponse> response = new List<PromotionCalculationResponse>();

            response.AddRange(ProcessResponse(filteredPromotions.Where(x => x.PromotionTypeId == (int)PromotionCalculationType.FlatDiscount).ToList(), request, PromotionCalculationType.FlatDiscount));
            if (request.IsFirstTimeCustomer)
            {
                response.AddRange(ProcessResponse(filteredPromotions.Where(x => x.PromotionTypeId == (int)PromotionCalculationType.NewCustomerDiscount && x.IsFirstTimeCustomer == true).ToList(), request, PromotionCalculationType.NewCustomerDiscount));
            }

            var comboPromotions = filteredPromotions.Where(x => x.PromotionTypeId == (int)PromotionCalculationType.ComboDiscount).ToList();
            if (comboPromotions.Any())
            {
                response.AddRange(ProcessResponse(comboPromotions, request, PromotionCalculationType.ComboDiscount));
            }

            var adultDiscountPromotions = filteredPromotions.Where(x => x.PromotionTypeId == (int)PromotionCalculationType.AdultDiscount && x.IsAdultTicketDiscount == true).ToList();
            if (adultDiscountPromotions.Any())
            {
                response.AddRange(ProcessResponse(adultDiscountPromotions, request, PromotionCalculationType.AdultDiscount));
            }

            var childDiscountPromotions = filteredPromotions.Where(x => x.PromotionTypeId == (int)PromotionCalculationType.ChildDiscount && x.IsChildTicketDiscount == true).ToList();
            if (childDiscountPromotions.Any())
            {
                response.AddRange(ProcessResponse(childDiscountPromotions, request, PromotionCalculationType.ChildDiscount));
            }

            var freePassengerDiscountPromotions = filteredPromotions.Where(x => x.PromotionTypeId == (int)PromotionCalculationType.FreePassengerDiscount).ToList();
            if (freePassengerDiscountPromotions.Any())
            {
                response.AddRange(ProcessResponse(freePassengerDiscountPromotions, request, PromotionCalculationType.FreePassengerDiscount));
            }

            var cabinDiscountPromotions = filteredPromotions.Where(x => x.PromotionTypeId == (int)PromotionCalculationType.CabinDiscount && x.CabinCountRequired <= request.CabinCount).ToList();
            if (cabinDiscountPromotions.Any())
            {
                response.AddRange(ProcessResponse(cabinDiscountPromotions, request, PromotionCalculationType.CabinDiscount));
            }

            response = response.OrderBy(x => request.PromoCodes == null || !request.PromoCodes.Any(x => !string.IsNullOrEmpty(x)) ||
                        (request.PromoCodes?.Any(x => !string.IsNullOrEmpty(x)) ?? false) &&
                        request.PromoCodes.Any(y => y.ToLowerInvariant() == x.PromoCode.ToLowerInvariant())).ToList();

            if (filteredPromotions.Count(x => x.IsStackable == true) > 1)
            {
                var stackablePromotions = response.Where(x => x.IsStackable == true).ToList();
                response.Add(new PromotionCalculationResponse
                {
                    Id = 0,
                    PromotionName = string.Join(", ", stackablePromotions.Select(x => x.PromotionName).ToArray()),
                    PromotionDescription = string.Join(", ", stackablePromotions.Select(x => x.PromotionDescription).ToArray()),
                    PromoCode = string.Join(", ", stackablePromotions.Select(x => x.PromoCode).ToArray()),
                    IncludesAirfare = stackablePromotions.Any(x => x.IncludesAirfare == true),
                    IncludesHotel = stackablePromotions.Any(x => x.IncludesHotel == true),
                    IncludesWiFi = stackablePromotions.Any(x => x.IncludesWiFi == true),
                    IncludesShoreExcursion = stackablePromotions.Any(x => x.IncludesShoreExcursion == true),
                    IsStackable = stackablePromotions.Any(x => x.IsStackable == true),
                    OnboardCreditAmount = stackablePromotions.Sum(x => x.OnboardCreditAmount),
                    Passengers = MapPassengersForStackable(stackablePromotions, request),
                    TotalBaseFare = request.BaseFare,
                    TotalDiscount = stackablePromotions.Sum(x => x.TotalDiscount),
                    TotalFare = request.BaseFare - stackablePromotions.Sum(x => x.TotalDiscount)
                });
            }

            return response;
        }

        public List<PassengerDetails> MapPassengersForStackable(List<PromotionCalculationResponse> promotionCalculationResponses, PromotionCalculationRequest request)
        {
            return request.Passengers.Select((p, index) => new PassengerDetails
            {
                Age = p.Age,
                BaseFare = p.BaseFare,
                Gender = p.Gender,
                RoomType = p.RoomType,
                Discount = promotionCalculationResponses.Select(x => x.Passengers[index]).Sum(x => x.Discount) > p.BaseFare ? p.BaseFare : promotionCalculationResponses.Select(x => x.Passengers[index]).Sum(x => x.Discount),
                Fare = promotionCalculationResponses.Select(x => x.Passengers[index]).Sum(x => x.Discount) > p.BaseFare ? 0 : p.BaseFare - promotionCalculationResponses.Select(x => x.Passengers[index]).Sum(x => x.Discount)
            }).ToList();
        }

        public List<DataAccess.Entities.Promotions.Promotions> GetFilteredRecords(List<DataAccess.Entities.Promotions.Promotions> promotions, PromotionCalculationType promotionCalculation)
        {
            var filteredResponse = new List<DataAccess.Entities.Promotions.Promotions>();

            switch (promotionCalculation)
            {
                case PromotionCalculationType.FlatDiscount:
                    filteredResponse = promotions.FindAll(x => (x.IsFirstTimeCustomer == null || x.IsFirstTimeCustomer.Value == false)
                    && (x.MinNoOfAdultRequired == null || x.MinNoOfAdultRequired.Value <= 0)
                    && (x.MinNoOfChildRequired == null || x.MinNoOfChildRequired.Value <= 0)
                    && (x.IsAdultTicketDiscount == null || x.IsAdultTicketDiscount.Value == false)
                    && (x.IsChildTicketDiscount == null || x.IsChildTicketDiscount.Value == false)
                    && (x.CabinCountRequired == null || x.CabinCountRequired.Value <= 0)).ToList();
                    break;
                default:
                    break;
            }

            return filteredResponse;
        }

        public List<PromotionCalculationResponse> ProcessResponse(List<DataAccess.Entities.Promotions.Promotions> promotions, PromotionCalculationRequest request, PromotionCalculationType promotionCalculation)
        {
            var response = new List<PromotionCalculationResponse>();
            foreach (var promotion in promotions)
            {
                switch (promotionCalculation)
                {
                    case PromotionCalculationType.FlatDiscount:
                        response.Add(GetPromotionDetails(promotion, request));
                        break;
                    case PromotionCalculationType.ComboDiscount:
                        var comboDiscount = GetPromotionDetailsForCombo(promotion, request);
                        if (comboDiscount != null)
                            response.Add(comboDiscount);
                        break;
                    case PromotionCalculationType.NewCustomerDiscount:
                        response.Add(GetPromotionDetails(promotion, request));
                        break;
                    case PromotionCalculationType.AdultDiscount:
                        var adultDiscount = GetPromotionDetailsForAdultDiscount(promotion, request);
                        if (adultDiscount != null)
                            response.Add(adultDiscount);
                        break;
                    case PromotionCalculationType.ChildDiscount:
                        var childDiscount = GetPromotionDetailsForChildDiscount(promotion, request);
                        if (childDiscount != null)
                            response.Add(childDiscount);
                        break;
                    case PromotionCalculationType.FreePassengerDiscount:
                        var freePassangerDiscount = GetPromotionDetailsForFreePassengerDiscount(promotion, request);
                        if (freePassangerDiscount != null)
                            response.Add(freePassangerDiscount);
                        break;
                    case PromotionCalculationType.CabinDiscount:
                        response.Add(GetPromotionDetails(promotion, request));
                        break;
                    default:
                        break;
                }
            }

            return response;
        }

        public PromotionCalculationResponse GetPromotionDetails(DataAccess.Entities.Promotions.Promotions promotionModel, PromotionCalculationRequest request)
        {
            var discount = GetDiscount(request.BaseFare, promotionModel.DiscountPer, promotionModel.DiscountAmount);

            var response = new PromotionCalculationResponse
            {
                Id = promotionModel.Id,
                PromotionName = promotionModel.PromotionName,
                PromotionDescription = promotionModel.PromotionDescription,
                PromoCode = promotionModel.PromoCode,
                IncludesAirfare = promotionModel.IncludesAirfare ?? false,
                IncludesHotel = promotionModel.IncludesHotel ?? false,
                IncludesWiFi = promotionModel.IncludesWiFi ?? false,
                IncludesShoreExcursion = promotionModel?.IncludesShoreExcursion ?? false,
                IsStackable = promotionModel?.IsStackable ?? false,
                OnboardCreditAmount = promotionModel?.OnboardCreditAmount ?? 0,
                Passengers = MapPassengers(request.Passengers, promotionModel),
                TotalBaseFare = request.BaseFare,
                TotalDiscount = discount,
                TotalFare = request.BaseFare - discount
            };
            return response;
        }
        public List<PassengerDetails> MapPassengers(List<PassengerRequestModel> passengers, DataAccess.Entities.Promotions.Promotions promotionModel, bool isChildDiscount = false, int? passangerIndex = null)
        {
            return passengers.Select((p, index) => new PassengerDetails
            {
                Age = p.Age,
                BaseFare = p.BaseFare,
                Gender = p.Gender,
                RoomType = p.RoomType,
                Discount = isChildDiscount && p.Age < 18 || passangerIndex - 1 == index ? p.BaseFare : GetDiscount(p.BaseFare, promotionModel.DiscountPer, promotionModel.DiscountAmount),
                Fare = isChildDiscount && p.Age < 18 || passangerIndex - 1 == index ? 0 : p.BaseFare - GetDiscount(p.BaseFare, promotionModel.DiscountPer, promotionModel.DiscountAmount)
            }).ToList();
        }

        public decimal GetDiscount(decimal baseFare, decimal? discountPer, decimal? discountAmt)
        {
            if (discountPer != null && discountPer.Value > 0)
            {
                return baseFare * (discountPer.Value / 100);
            }
            else if (discountAmt != null && discountAmt.Value > 0)
            {
                return discountAmt.Value;
            }
            return 0;
        }

        public PromotionCalculationResponse GetPromotionDetailsForCombo(DataAccess.Entities.Promotions.Promotions promotionModel, PromotionCalculationRequest request)
        {
            decimal discount = 0;

            if (promotionModel.MinNoOfAdultRequired <= request.Passengers.Count(x => x.Age >= 18) &&
                promotionModel.MinNoOfChildRequired <= request.Passengers.Count(x => x.Age < 18))
            {
                discount = GetDiscount(request.BaseFare, promotionModel.DiscountPer, promotionModel.DiscountAmount);
                return new PromotionCalculationResponse
                {
                    Id = promotionModel.Id,
                    PromotionName = promotionModel.PromotionName,
                    PromotionDescription = promotionModel.PromotionDescription,
                    PromoCode = promotionModel.PromoCode,
                    IncludesAirfare = promotionModel.IncludesAirfare ?? false,
                    IncludesHotel = promotionModel.IncludesHotel ?? false,
                    IncludesWiFi = promotionModel.IncludesWiFi ?? false,
                    IncludesShoreExcursion = promotionModel?.IncludesShoreExcursion ?? false,
                    IsStackable = promotionModel?.IsStackable ?? false,
                    OnboardCreditAmount = promotionModel?.OnboardCreditAmount ?? 0,
                    Passengers = MapPassengers(request.Passengers, promotionModel),
                    TotalBaseFare = request.BaseFare,
                    TotalDiscount = discount,
                    TotalFare = request.BaseFare - discount
                };
            }
            return null;
        }

        public PromotionCalculationResponse GetPromotionDetailsForAdultDiscount(DataAccess.Entities.Promotions.Promotions promotionModel, PromotionCalculationRequest request)
        {
            decimal discount = 0;
            if (promotionModel.MinNoOfAdultRequired <= request.Passengers.Count(x => x.Age >= 18) &&
                promotionModel.MinNoOfChildRequired <= request.Passengers.Count(x => x.Age < 18)
                && request.Passengers.Any(x => x.Age >= promotionModel.MinPassengerAge))
            {
                discount = GetDiscount(request.BaseFare, promotionModel.DiscountPer, promotionModel.DiscountAmount);
                return new PromotionCalculationResponse
                {
                    Id = promotionModel.Id,
                    PromotionName = promotionModel.PromotionName,
                    PromotionDescription = promotionModel.PromotionDescription,
                    PromoCode = promotionModel.PromoCode,
                    IncludesAirfare = promotionModel.IncludesAirfare ?? false,
                    IncludesHotel = promotionModel.IncludesHotel ?? false,
                    IncludesWiFi = promotionModel.IncludesWiFi ?? false,
                    IncludesShoreExcursion = promotionModel?.IncludesShoreExcursion ?? false,
                    IsStackable = promotionModel?.IsStackable ?? false,
                    OnboardCreditAmount = promotionModel?.OnboardCreditAmount ?? 0,
                    Passengers = MapPassengers(request.Passengers, promotionModel),
                    TotalBaseFare = request.BaseFare,
                    TotalDiscount = discount,
                    TotalFare = request.BaseFare - discount
                };
            }
            return null;
        }

        public PromotionCalculationResponse GetPromotionDetailsForChildDiscount(DataAccess.Entities.Promotions.Promotions promotionModel, PromotionCalculationRequest request)
        {
            decimal discount = 0;
            if (promotionModel.MinNoOfAdultRequired <= request.Passengers.Count(x => x.Age >= 18) &&
                promotionModel.MinNoOfChildRequired <= request.Passengers.Count(x => x.Age < 18)
                && request.Passengers.Any(x => x.Age >= promotionModel.MaxPassengerAge))
            {
                if (promotionModel.DiscountPer.HasValue && promotionModel.DiscountPer.Value > 0 ||
                    promotionModel.DiscountAmount.HasValue && promotionModel.DiscountAmount.Value > 0)
                {
                    discount = GetDiscount(request.BaseFare, promotionModel.DiscountPer, promotionModel.DiscountAmount);
                    return new PromotionCalculationResponse
                    {
                        Id = promotionModel.Id,
                        PromotionName = promotionModel.PromotionName,
                        PromotionDescription = promotionModel.PromotionDescription,
                        PromoCode = promotionModel.PromoCode,
                        IncludesAirfare = promotionModel.IncludesAirfare ?? false,
                        IncludesHotel = promotionModel.IncludesHotel ?? false,
                        IncludesWiFi = promotionModel.IncludesWiFi ?? false,
                        IncludesShoreExcursion = promotionModel?.IncludesShoreExcursion ?? false,
                        IsStackable = promotionModel?.IsStackable ?? false,
                        OnboardCreditAmount = promotionModel?.OnboardCreditAmount ?? 0,
                        Passengers = MapPassengers(request.Passengers, promotionModel, true),
                        TotalBaseFare = request.BaseFare,
                        TotalDiscount = discount,
                        TotalFare = request.BaseFare - discount
                    };
                }
                else
                {
                    discount = GetDiscount(request.BaseFare, 0, request.Passengers.Where(x => x.Age < 18).Sum(x => x.BaseFare));
                    return new PromotionCalculationResponse
                    {
                        Id = promotionModel.Id,
                        PromotionName = promotionModel.PromotionName,
                        PromotionDescription = promotionModel.PromotionDescription,
                        PromoCode = promotionModel.PromoCode,
                        IncludesAirfare = promotionModel.IncludesAirfare ?? false,
                        IncludesHotel = promotionModel.IncludesHotel ?? false,
                        IncludesWiFi = promotionModel.IncludesWiFi ?? false,
                        IncludesShoreExcursion = promotionModel?.IncludesShoreExcursion ?? false,
                        IsStackable = promotionModel?.IsStackable ?? false,
                        OnboardCreditAmount = promotionModel?.OnboardCreditAmount ?? 0,
                        Passengers = MapPassengers(request.Passengers, promotionModel),
                        TotalBaseFare = request.BaseFare,
                        TotalDiscount = discount,
                        TotalFare = request.BaseFare - discount
                    };
                }

            }
            return null;
        }

        public PromotionCalculationResponse GetPromotionDetailsForFreePassengerDiscount(DataAccess.Entities.Promotions.Promotions promotionModel, PromotionCalculationRequest request)
        {
            decimal discount = 0;
            if (promotionModel.FreeNthPassenger.HasValue && promotionModel.FreeNthPassenger.Value > 0
                && promotionModel.FreeNthPassenger.Value <= request.Passengers.Count)
            {
                discount = GetDiscount(request.BaseFare, 0, request.Passengers[promotionModel.FreeNthPassenger.Value - 1].BaseFare);
                return new PromotionCalculationResponse
                {
                    Id = promotionModel.Id,
                    PromotionName = promotionModel.PromotionName,
                    PromotionDescription = promotionModel.PromotionDescription,
                    PromoCode = promotionModel.PromoCode,
                    IncludesAirfare = promotionModel.IncludesAirfare ?? false,
                    IncludesHotel = promotionModel.IncludesHotel ?? false,
                    IncludesWiFi = promotionModel.IncludesWiFi ?? false,
                    IncludesShoreExcursion = promotionModel?.IncludesShoreExcursion ?? false,
                    IsStackable = promotionModel?.IsStackable ?? false,
                    OnboardCreditAmount = promotionModel?.OnboardCreditAmount ?? 0,
                    Passengers = MapPassengers(request.Passengers, promotionModel, passangerIndex: promotionModel.FreeNthPassenger.Value),
                    TotalBaseFare = request.BaseFare,
                    TotalDiscount = discount,
                    TotalFare = request.BaseFare - discount
                };
            }
            return null;
        }

        public async Task<List<IdNameValueModel<DateTime>>> GetSailDate()
        {
            return await _repository.GetSailDate();
        }

        public async Task<List<IdNameModel<int>>> GetDestinationBySailDate(DateTime sailDate)
        {
            return await _repository.GetDestinationBySailDate(sailDate);
        }

        public async  Task<List<IdNameModel<int>>> GetCruiseLineBySailDate(DateTime sailDate)
        {
            return await _repository.GetCruiseLineBySailDate(sailDate);
        }
        public async  Task<List<IdNameModel<int>>> GetGroupIdBySailDate(DateTime sailDate)
        {
            return await _repository.GetGroupIdBySailDate(sailDate);
        }

        public async Task<List<IdNameModel<int>>> GetPromotionType()
        {
            return await _repository.GetPromotionType();
        }
    }
}

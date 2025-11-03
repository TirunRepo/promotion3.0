using AutoMapper;
using MarketPlace.Common.DTOs;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.RequestModels.Markup;
using MarketPlace.Common.DTOs.RequestModels.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MarketPlace.DataAccess.Entities;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Entities.Markup;
using MarketPlace.DataAccess.Entities.Promotions;

namespace MarketPlace.Common.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, LoginResponse>()
                .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id));

            CreateMap<User, AuthDto>()
                .ForMember(d => d.UserId, opt => opt.MapFrom(s => s.Id));
            CreateMap<RegisterUser, User>().ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            CreateMap<Promotions, PromotionRequest>().ReverseMap();
            CreateMap<Promotions, PromotionResponse>().ReverseMap();

            CreateMap<PromotionCalculationRequest, Promotions>().ReverseMap();
            CreateMap<Promotions, PromotionCalculationResponse>();
            CreateMap<MarkupDetail, MarkupRequest>().ReverseMap();
            CreateMap<MarkupDetail, MarkupResponse>().ReverseMap();
            // ========================
            // Cruiseline ↔ CruiselineDto
            // ========================
            CreateMap<CruiseLine, CruiseLineResponse>().ReverseMap();
            CreateMap<CruiseLine, CruiseLineRequest>().ReverseMap();
            CreateMap<CruiseLine, CruiseLineModal>().ReverseMap();
            CreateMap<CruiseCabin, CruiseCabinRequest>().ReverseMap();
            CreateMap<CruiseCabin, CruiseCabinResponse>().ReverseMap();
            CreateMap<CruiseShip, CruiseShipReponse>().ReverseMap();
            CreateMap<CruiseShip, CruiseShipRequest>().ReverseMap();
            //
            CreateMap<Destination, DestinationRequest>().ReverseMap();
            CreateMap<Destination, DestinationResponse>().ReverseMap();
            CreateMap<CruisePricing, CruisePricingModel>().ReverseMap();
            CreateMap<CruisePricing, CruisePricingResponse>().ReverseMap();
            CreateMap<DeparturePort, DeparturePortRequest>().ReverseMap();
            CreateMap<DeparturePort, CruiseDeparturePortResponse>().ReverseMap();
            CreateMap<CruiseInventory, CruiseInventoryResponse>().ReverseMap();
            CreateMap<CruiseInventoryResponse, CruiseCabinResponse>().ReverseMap();
            CreateMap<CruiseInventoryResponse, CruisePricingResponse>().ReverseMap();
            CreateMap<CruiseInventory, CruiseInventoryModel>()
                 .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));
            CreateMap<CruiseInventoryModel, CruiseInventory>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));
        }
    }
}

using AutoMapper;
using MarketPlace.Business.Services.Interface.Promotions;
using MarketPlace.Common.APIResponse;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MediatR;

namespace MarketPlace.Infrastucture.Promotion.Commands.CalculatePromotion
{
    public class CalculatePromotionHandler : IRequestHandler<CalculatePromotionCommand, APIResponse<List<PromotionCalculationResponse>>>
    {
        private readonly IPromotionService _promotionService;

        public CalculatePromotionHandler(IPromotionService promotionService)
        {
            _promotionService = promotionService;
        }

        public async Task<APIResponse<List<PromotionCalculationResponse>>> Handle(CalculatePromotionCommand request, CancellationToken cancellationToken)
        {
            var result = await _promotionService.CalculateDiscountAsync(request.Request);
            return APIResponse<List<PromotionCalculationResponse>>.Ok(result);
        }
    }

}

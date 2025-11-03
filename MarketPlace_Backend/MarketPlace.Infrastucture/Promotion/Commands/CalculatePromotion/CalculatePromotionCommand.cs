using MarketPlace.Common.APIResponse;
using MarketPlace.Common.DTOs.RequestModels.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MediatR;

namespace MarketPlace.Infrastucture.Promotion.Commands.CalculatePromotion
{
    public class CalculatePromotionCommand : IRequest<APIResponse<List<PromotionCalculationResponse>>>
    {
        public PromotionCalculationRequest Request { get; set; }

        public CalculatePromotionCommand(PromotionCalculationRequest request)
        {
            Request = request;
        }

    }
}

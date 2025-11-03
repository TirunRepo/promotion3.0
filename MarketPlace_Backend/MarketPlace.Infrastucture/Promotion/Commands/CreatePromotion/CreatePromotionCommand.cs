using MarketPlace.Common.DTOs.RequestModels.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MediatR;

namespace MarketPlace.Infrastucture.Promotion.Commands.CreatePromotion
{
    public class CreatePromotionCommand : IRequest<PromotionResponse>
    {
        public PromotionRequest PromotionRequest { get; }

        public CreatePromotionCommand(PromotionRequest promotion)
        {
            PromotionRequest = promotion;
        }
    }
}

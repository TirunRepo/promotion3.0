using MarketPlace.Common.DTOs.RequestModels.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MediatR;

namespace MarketPlace.Infrastucture.Promotion.Commands.UpdatePromotion
{
    public class UpdatePromotionCommand : IRequest<PromotionResponse>
    {
        public PromotionRequest Promotion { get; }

        public UpdatePromotionCommand(PromotionRequest promotion)
        {
            Promotion = promotion;
        }
    }
}

using MarketPlace.Business.Services.Interface.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MediatR;

namespace MarketPlace.Infrastucture.Promotion.Commands.UpdatePromotion
{
    public class UpdatePromotionHandler : IRequestHandler<UpdatePromotionCommand, PromotionResponse>
    {
        private readonly IPromotionService _service;

        public UpdatePromotionHandler(IPromotionService service)
        {
            _service = service;
        }

        public async Task<PromotionResponse> Handle(UpdatePromotionCommand request, CancellationToken cancellationToken)
        {
            return await _service.UpdateAsync(request.Promotion);
        }
    }

}

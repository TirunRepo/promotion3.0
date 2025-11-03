using MarketPlace.Business.Services.Interface.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MarketPlace.Infrastucture.Promotion.Commands.CreatePromotion;
using MediatR;

namespace Promotion.Infrastructure.Commands
{
    public class CreatePromotionHandler : IRequestHandler<CreatePromotionCommand, PromotionResponse>
    {
        private readonly IPromotionService _service;

        public CreatePromotionHandler(IPromotionService service)
        {
            _service = service;
        }


        public async Task<PromotionResponse> Handle(CreatePromotionCommand request, CancellationToken cancellationToken)
        {
            return await _service.CreateAsync(request.PromotionRequest);
        }
    }
}

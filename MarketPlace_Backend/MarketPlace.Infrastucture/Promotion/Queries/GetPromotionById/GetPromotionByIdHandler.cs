using MarketPlace.Business.Services.Interface.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MediatR;

namespace MarketPlace.Infrastucture.Promotion.Queries.GetPromotionById
{
    public class GetPromotionByIdHandler : IRequestHandler<GetPromotionByIdQuery, PromotionResponse?>
    {
        private readonly IPromotionService _service;

        public GetPromotionByIdHandler(IPromotionService service)
        {
            _service = service;
        }

        public async Task<PromotionResponse?> Handle(GetPromotionByIdQuery request, CancellationToken cancellationToken)
        {
            return await _service.GetByIdAsync(request.Id);
        }
    }

}

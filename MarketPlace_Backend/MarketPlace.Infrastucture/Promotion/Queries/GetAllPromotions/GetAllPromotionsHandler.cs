using MarketPlace.Business.Services.Interface.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MediatR;
using Promotion.Infrastructure.Queries;

namespace MarketPlace.Infrastucture.Promotion.Queries.GetAllPromotions
{
    public class GetAllPromotionsHandler : IRequestHandler<GetAllPromotionsQuery, List<PromotionResponse>>
    {
        private readonly IPromotionService _service;

        public GetAllPromotionsHandler(IPromotionService service)
        {
            _service = service;
        }

        public async Task<List<PromotionResponse>> Handle(GetAllPromotionsQuery request, CancellationToken cancellationToken)
        {
            return await _service.GetAllAsync();
        }
    }

}

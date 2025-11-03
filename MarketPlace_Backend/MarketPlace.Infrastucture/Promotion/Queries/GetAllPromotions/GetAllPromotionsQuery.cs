using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MediatR;

namespace Promotion.Infrastructure.Queries
{
    public class GetAllPromotionsQuery : IRequest<List<PromotionResponse>> { }
}

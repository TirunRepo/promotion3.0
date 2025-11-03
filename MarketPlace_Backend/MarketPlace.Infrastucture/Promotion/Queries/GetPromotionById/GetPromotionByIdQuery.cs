using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MediatR;

namespace MarketPlace.Infrastucture.Promotion.Queries.GetPromotionById
{
    public class GetPromotionByIdQuery : IRequest<PromotionResponse?>
    {
        public int Id { get; }

        public GetPromotionByIdQuery(int id)
        {
            Id = id;
        }
    }
}

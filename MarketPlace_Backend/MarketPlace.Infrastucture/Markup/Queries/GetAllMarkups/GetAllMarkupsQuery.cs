using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MediatR;


namespace MarketPlace.Infrastucture.Markup.Queries.GetAllMarkups
{
    public class GetAllMarkupsQuery : IRequest<List<MarkupResponse>>
    {
        public GetAllMarkupsQuery()
        {
        }
    }
}

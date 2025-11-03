using MarketPlace.Common.DTOs.RequestModels.Markup;
using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MediatR;

namespace MarketPlace.Infrastucture.Markup.Commands.CalculateMarkup
{
    public class CalculateMarkupCommand : IRequest<MarkupCalculationResponse>
    {
        public MarkupCalculationRequest MarkupCalculationRequest { get; }

        public CalculateMarkupCommand(MarkupCalculationRequest markup)
        {
            MarkupCalculationRequest = markup;
        }
    }
}

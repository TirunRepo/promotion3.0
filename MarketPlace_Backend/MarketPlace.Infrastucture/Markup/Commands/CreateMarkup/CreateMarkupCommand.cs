using MarketPlace.Common.DTOs.RequestModels.Markup;
using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Infrastucture.Markup.Commands.CreateMarkup
{
    public class CreateMarkupCommand : IRequest<MarkupResponse>
    {
        public MarkupRequest MarkupRequest { get; }

        public CreateMarkupCommand(MarkupRequest markup)
        {
            MarkupRequest = markup;
        }
    }
}

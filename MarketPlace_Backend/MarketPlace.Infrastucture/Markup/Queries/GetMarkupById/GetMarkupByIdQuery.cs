using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Infrastucture.Markup.Queries.GetMarkupById
{
    public class GetMarkupByIdQuery : IRequest<MarkupResponse>
    {
        public int Id { get; }

        public GetMarkupByIdQuery(int id)
        {
            Id = id;
        }
    }
}

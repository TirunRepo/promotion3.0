using AutoMapper;
using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MarketPlace.DataAccess.Repositories.Markup.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Infrastucture.Markup.Queries.GetMarkupById
{
    public class GetMarkupByIdHandler : IRequestHandler<GetMarkupByIdQuery, MarkupResponse?>
    {
        private readonly IMarkupRepository _service;
        private readonly IMapper _mapper;

        public GetMarkupByIdHandler(IMarkupRepository service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        public async Task<MarkupResponse> Handle(GetMarkupByIdQuery request, CancellationToken cancellationToken)
        {
            var response = await _service.GetByIdAsync(request.Id);
            return _mapper.Map<MarkupResponse>(response);
        }
    }
}

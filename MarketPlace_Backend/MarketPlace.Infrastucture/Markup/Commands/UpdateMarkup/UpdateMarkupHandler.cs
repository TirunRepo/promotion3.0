using AutoMapper;
using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MarketPlace.DataAccess.Entities.Markup;
using MarketPlace.DataAccess.Repositories.Markup.Interface;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Infrastucture.Markup.Commands.UpdateMarkup
{
    public class UpdateMarkupHandler : IRequestHandler<UpdateMarkupCommand, MarkupResponse>
    {
        private readonly IMarkupRepository _service;
        private readonly IMapper _mapper;

        public UpdateMarkupHandler(IMarkupRepository service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        public async Task<MarkupResponse> Handle(UpdateMarkupCommand request, CancellationToken cancellationToken)
        {
            var response = await _service.UpdateAsync(_mapper.Map<MarkupDetail>(request.MarkupRequest));
            return _mapper.Map<MarkupResponse>(response);
        }
    }
}

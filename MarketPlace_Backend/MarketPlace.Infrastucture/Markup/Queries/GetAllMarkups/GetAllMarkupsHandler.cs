using AutoMapper;
using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MarketPlace.DataAccess.Repositories.Markup.Interface;
using MediatR;

namespace MarketPlace.Infrastucture.Markup.Queries.GetAllMarkups
{
    public class GetAllMarkupsHandler : IRequestHandler<GetAllMarkupsQuery, List<MarkupResponse>>
    {
        private readonly IMarkupRepository _service;
        private readonly IMapper _mapper;

        public GetAllMarkupsHandler(IMarkupRepository service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        public async Task<List<MarkupResponse>> Handle(GetAllMarkupsQuery request, CancellationToken cancellationToken)
        {
            var response = await _service.GetMarkupDetails();
            return _mapper.Map<List<MarkupResponse>>(response);
        }
    }
}

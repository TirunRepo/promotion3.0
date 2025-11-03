using AutoMapper;
using MarketPlace.Business.Services.Interface.MarkUps;
using MarketPlace.Common.CommonModel;
using MarketPlace.DataAccess.Repositories.Markup.Interface;
using MarketPlace.DataAccess.Repositories.Promotions.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Services.MarkUps
{
    public class MarkUpsService :IMarkupsService
    {
        private readonly IMarkupRepository _repository;
        private readonly IMapper _mapper;

        public MarkUpsService(IMarkupRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<IdNameValueModel<DateTime>>> GetSailDate()
        {
            return await _repository.GetSailDate();
        }
        public async Task<List<IdNameModel<int>>> GetGroupId(DateTime saildate) => await _repository.GetGroupId(saildate);

        public async Task<List<IdNameModel<int>>> GetCategoryId(DateTime saildate, string groupId) => await _repository.GetCategoryId(saildate, groupId);

        public async Task<MarkUpCabinOccupancyModel> GetCabinOccupancy(int id) => await _repository.GetCabinOccupancy(id);

        public async Task<PromotiosDetailsModel> GetPromotionDetails(DateTime sailDate, string groupId, int destinationId, int cruiseLineId) => await _repository.GetPromotionDetails(sailDate,groupId, destinationId,cruiseLineId);

        public async Task<ShipDetailsModel> GetShipDetails(int id) => await _repository.GetShipDetails(id);

        public async Task<bool> CheckDuplicateMarkup(DateTime sailDate, string groupId, string categoryId, string cabinOccupancy)
        {
            return await _repository.CheckDuplicateMarkup(sailDate, groupId, categoryId, cabinOccupancy);
        }

    }
}

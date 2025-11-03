using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Interface.MarkUps
{
    public interface IMarkupsService
    {
        Task<List<IdNameValueModel<DateTime>>> GetSailDate();

        Task<List<IdNameModel<int>>> GetGroupId(DateTime saildate);
        Task<List<IdNameModel<int>>> GetCategoryId(DateTime saildate, string groupId);

        Task<MarkUpCabinOccupancyModel> GetCabinOccupancy(int id);

        Task<PromotiosDetailsModel> GetPromotionDetails(DateTime sailDate, string groupId, int destinationId, int cruiseLineId);

        Task<ShipDetailsModel> GetShipDetails(int id);

        Task<bool> CheckDuplicateMarkup(DateTime sailDate, string groupId, string categoryId, string cabinOccupancy);

    }
}

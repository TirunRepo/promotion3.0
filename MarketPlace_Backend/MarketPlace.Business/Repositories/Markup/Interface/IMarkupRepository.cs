using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MarketPlace.DataAccess.Entities.Markup;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.DataAccess.Repositories.Markup.Interface
{
    public interface IMarkupRepository
    {
        Task<MarkupDetail> AddAsync(MarkupDetail entity);
        Task<MarkupDetail> UpdateAsync(MarkupDetail entity);
        Task DeleteAsync(int id);
        Task<List<MarkupResponse>> GetMarkupDetails();
        Task<MarkupDetail> GetByIdAsync(int id);
        Task<List<IdNameValueModel<DateTime>>> GetSailDate();

        Task<List<IdNameModel<int>>> GetGroupId(DateTime saildate);
        Task<List<IdNameModel<int>>> GetCategoryId(DateTime saildate,string groupId);
        Task<MarkUpCabinOccupancyModel> GetCabinOccupancy(int id);
        Task<PromotiosDetailsModel> GetPromotionDetails(DateTime sailDate, string groupId, int destinationId, int cruiseLineId);
        Task<ShipDetailsModel> GetShipDetails(int id);
        Task<bool> CheckDuplicateMarkup(DateTime sailDate, string groupId, string categoryId, string cabinOccupancy);


    }
}

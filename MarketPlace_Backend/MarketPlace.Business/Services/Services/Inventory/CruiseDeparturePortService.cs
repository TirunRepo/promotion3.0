using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Services.Inventory
{
    public class CruiseDeparturePortService : IDeparturePortService
    {
        private readonly ICruiseDeparturePortRepository _departurePortRepository;

        public CruiseDeparturePortService(ICruiseDeparturePortRepository departurePortRepository)
        {
            _departurePortRepository = departurePortRepository ?? throw new ArgumentNullException(nameof(departurePortRepository));
        }

        public async Task<PagedData<CruiseDeparturePortResponse>> GetList(int page, int pageSize)
        {
            return await _departurePortRepository.GetList(page, pageSize);
        }


        public async Task<CruiseDeparturePortResponse> GetById(int id)
        {
            return await _departurePortRepository.GetById(id);
        }

        public async Task<DeparturePortRequest> Insert(DeparturePortRequest model)
        {
            return await _departurePortRepository.Insert(model);
        }

        public async Task<DeparturePortRequest> Update(int Id,DeparturePortRequest model)
        {
            return await _departurePortRepository.Update(Id,model);
        }

        public async Task<bool> Delete(int id)
        {
            return await _departurePortRepository.Delete(id);
        }

    }
}

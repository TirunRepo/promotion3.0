using MarketPlace.Business.Repositories.Inventory.Interface;
using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Entities.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Services.Inventory
{

    public class CruiseShipServices : ICruiseShipService
    {

        private readonly ICruiseShipRepository _cruiseShipRepository;

        public CruiseShipServices(ICruiseShipRepository cruiseShipRepository)
        {
            _cruiseShipRepository = cruiseShipRepository ?? throw new ArgumentNullException(nameof(cruiseShipRepository));
        }

        public async Task<CruiseShipRequest> Insert(CruiseShipRequest model)
        {
            return await _cruiseShipRepository.Insert(model);
        }

        public async Task<CruiseShipRequest> Update(int Id, CruiseShipRequest model)
        {
            return await _cruiseShipRepository.Update(Id,model);
        }

        public async Task<CruiseShipReponse> GetById(int Id)
        {
            return await _cruiseShipRepository.GetById(Id);
        }

        public async Task<PagedData<CruiseShipReponse>>GetList(int page, int pageSize)
        {
            return await _cruiseShipRepository.GetList(page, pageSize);
        }

        public async Task<bool> Delete(int Id)
        {
            return await _cruiseShipRepository.Delete(Id);
        }

    }
}

using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using MarketPlace.DataAccess.Repositories.Inventory.Respository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Services.Inventory
{
    public class CruiseLineService : ICruiseLineService
    {
        private readonly ICruiseLineRepository _cruiselineRepository;

        public CruiseLineService(ICruiseLineRepository cruiselineRepository)
        {
            _cruiselineRepository = cruiselineRepository ?? throw new ArgumentNullException(nameof(cruiselineRepository));
        }



        public async Task<CruiseLineRequest> Insert(CruiseLineRequest model)
        {
            return await _cruiselineRepository.Insert(model);
        }


        public async Task<CruiseLineRequest> Update(int Id, CruiseLineRequest model)
        {
            return await _cruiselineRepository.Update(Id,model);
        }

        public async Task<CruiseLineModal> GetById(int Id)
        {
            return await _cruiselineRepository.GetById(Id);
        }

        public async Task<PagedData<CruiseLineResponse>> GetList(int page, int pageSize)
        {
            return await _cruiselineRepository.GetList(page, pageSize);
        }

        public async Task<List<IdNameModel<int>>> Get()
        {
            return await _cruiselineRepository.Get();
        }
        public async Task<bool> Delete(int id)
        {
            return await _cruiselineRepository.Delete(id);
        }






    }
}

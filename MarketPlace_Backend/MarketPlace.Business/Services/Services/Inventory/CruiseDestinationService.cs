using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using MarketPlace.DataAccess.Repositories.Inventory.Respository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Services.Services.Inventory
{
    public class CruiseDestinationService : IDestinationService
    {
        private readonly ICruiseDestinationRepository _destinationRepository;

        public CruiseDestinationService(ICruiseDestinationRepository destinationRepository)
        {
            _destinationRepository = destinationRepository ?? throw new ArgumentNullException(nameof(destinationRepository));
        }
        public async Task<PagedData<DestinationResponse>> GetList(int page, int pageSize)
        {
            return await _destinationRepository.GetList(page, pageSize);
        }

        public async Task<DestinationResponse> GetById(int id)
        {
            return await _destinationRepository.GetById(id);
        }

        public async Task<DestinationRequest> Insert(DestinationRequest model)
        {
            return await _destinationRepository.Insert(model);
        }

        public async Task<DestinationRequest> Update(int Id, DestinationRequest model)
        {
            return await _destinationRepository.Update(Id, model);
        }

        public async Task<bool> Delete(int id)
        {
            return await _destinationRepository.Delete(id);
        }
        public async Task<List<IdNameModel<int>>> Get()
        {
            return await _destinationRepository.Get();
        }
    }
}

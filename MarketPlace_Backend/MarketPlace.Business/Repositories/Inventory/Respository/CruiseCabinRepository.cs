using AutoMapper;
using MarketPlace.Business.Repositories.Inventory.Interface;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Repositories.Inventory.Respository
{
    public class CruiseCabinRepository:ICruiseCabinRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CruiseCabinRepository(AppDbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<CruiseCabinRequest> Insert(CruiseCabinRequest model)
        {
            var entity = _mapper.Map<CruiseCabin>(model);


            _context.CruiseCabin.Add(entity);
            await _context.SaveChangesAsync();

            return _mapper.Map<CruiseCabinRequest>(entity);
        }

        public async Task<CruiseCabinRequest> Update(CruiseCabinResponse model)
        {
            var existingEntity = await _context.CruiseCabin
        .FirstOrDefaultAsync(x => x.Id == model.Id);

            if (existingEntity == null)
                throw new Exception($"CruiseCabin with Id {model.Id} not found.");

            // Map only updated fields to the existing entity
            _mapper.Map(model, existingEntity);

            await _context.SaveChangesAsync();

            return _mapper.Map<CruiseCabinRequest>(existingEntity);
        }

        public async Task<CruiseCabinRequest> Remove(CruiseCabinResponse? model)
        {
            var entity = _mapper.Map<CruiseCabin>(model);


            _context.CruiseCabin.Remove(entity);
            await _context.SaveChangesAsync();

            return _mapper.Map<CruiseCabinRequest>(entity);
        }
        public async Task<bool> Delete(int id)
        {
            var cruise = await _context.CruiseCabin.FindAsync(id);
            _context.CruiseCabin.Remove(cruise);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<CruiseCabinResponse>> GetByInventoryIdsAsync(List<int> inventoryIds)
        {
            var cabin = await _context.CruiseCabin
                .Where(x => inventoryIds.Contains(x.CruiseInventoryId))
                .ToListAsync();

            return _mapper.Map<List<CruiseCabinResponse>>(cabin);

        }

    }
}

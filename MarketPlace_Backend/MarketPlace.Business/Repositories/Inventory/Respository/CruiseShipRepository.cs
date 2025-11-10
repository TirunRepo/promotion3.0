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

namespace MarketPlace.DataAccess.Repositories.Inventory.Respository
{
    public class CruiseShipRepository : ICruiseShipRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CruiseShipRepository(AppDbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<CruiseShipRequest> Insert(CruiseShipRequest model)
        {
            var cruiseShip = _mapper.Map<CruiseShip>(model);
            _context.CruiseShips.Add(cruiseShip);
            await _context.SaveChangesAsync();
            return _mapper.Map<CruiseShipRequest>(cruiseShip);
        }

        public async Task<CruiseShipRequest> Update(int Id,CruiseShipRequest model)
        {
            try
            {
                var cruiseShip = await _context.CruiseShips.FindAsync(Id);

                if (cruiseShip == null)
                    throw new KeyNotFoundException("Cruise ship not found");

                _mapper.Map(model, cruiseShip);
                await _context.SaveChangesAsync();
                return _mapper.Map<CruiseShipRequest>(cruiseShip);
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        public async Task<CruiseShipReponse> GetById(int id)
        {
            var cruiseShip = await _context.CruiseShips
                .FirstOrDefaultAsync(cs => cs.Id == id);

            return cruiseShip == null ? null : _mapper.Map<CruiseShipReponse>(cruiseShip);
        }
        public async Task<PagedData<CruiseShipReponse>> GetList(int page = 1, int pageSize = 10)
        {
            var query = _context.CruiseShips.AsQueryable();

            var totalCount = await query.CountAsync();

            var cruiseShips = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var mappedShips = _mapper.Map<List<CruiseShipReponse>>(cruiseShips);

            return new PagedData<CruiseShipReponse>
            {
                Items = mappedShips,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }

        public async Task<bool> Delete(int id)
        {
            var cruiseShip = await _context.CruiseShips.FindAsync(id);
            if (cruiseShip == null) return false;

            _context.CruiseShips.Remove(cruiseShip);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<CruiseShip>> GetAll()
        {
            var cruiseShips = await _context.CruiseShips.ToListAsync();
            return cruiseShips;
        }

    }
}

using AutoMapper;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using Microsoft.EntityFrameworkCore;

namespace MarketPlace.Business.Repositories.Inventory.Respository
{
    public class CruiseDeparturePortRepository : ICruiseDeparturePortRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CruiseDeparturePortRepository(AppDbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<DeparturePortRequest> Insert(DeparturePortRequest model)
        {
            var entity = _mapper.Map<DeparturePort>(model);


            _context.DeparturePorts.Add(entity);
            await _context.SaveChangesAsync();

            return _mapper.Map<DeparturePortRequest>(entity);
        }

        public async Task<DeparturePortRequest> Update(int Id, DeparturePortRequest model)
        {
            var existing = await _context.DeparturePorts.FindAsync(Id);

            if (existing == null)
                throw new KeyNotFoundException("Departure Port not found");

            _mapper.Map(model, existing);

            await _context.SaveChangesAsync();

            return _mapper.Map<DeparturePortRequest>(existing);
        }


        public async Task<bool> Delete(int id)
        {
            var departurePort = await _context.DeparturePorts.FindAsync(id);
            if (departurePort == null) return false;

            _context.DeparturePorts.Remove(departurePort);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<PagedData<CruiseDeparturePortResponse>> GetList(int page = 1, int pageSize = 10)
        {
            var query = _context.DeparturePorts.AsQueryable();

            var totalCount = await query.CountAsync();

            var cruiseShips = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var mappedShips = _mapper.Map<List<CruiseDeparturePortResponse>>(cruiseShips);

            return new PagedData<CruiseDeparturePortResponse>
            {
                Items = mappedShips,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }
        public async Task<CruiseDeparturePortResponse> GetById(int id)
        {
            var port = await _context.DeparturePorts.FindAsync(id);

            return port == null ? null : _mapper.Map<CruiseDeparturePortResponse>(port);
        }

    }
}

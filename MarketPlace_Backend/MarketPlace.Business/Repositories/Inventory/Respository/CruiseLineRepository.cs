using AutoMapper;
using Azure;
using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.DataAccess.Repositories.Inventory.Respository
{
    public class CruiseLineRepository : ICruiseLineRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CruiseLineRepository(AppDbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public async Task<CruiseLineRequest> Insert(CruiseLineRequest model)
        {
            var entity = _mapper.Map<CruiseLine>(model);
            _context.CruiseLines.Add(entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<CruiseLineRequest>(entity);
        }

        public async Task<CruiseLineRequest> Update(int Id, CruiseLineRequest model)
        {
            var entity = await _context.CruiseLines.FindAsync(Id);
            if (entity == null) throw new KeyNotFoundException("Cruise line not found");
            
            _mapper.Map(model, entity);
            await _context.SaveChangesAsync();
            return _mapper.Map<CruiseLineRequest>(entity);
        }

        public async Task<CruiseLineModal> GetById(int Id)
        {
            var entity = await _context.CruiseLines.FindAsync(Id);
            return entity == null ? null : _mapper.Map<CruiseLineModal>(entity);
        }

        public async Task<PagedData<CruiseLineResponse>> GetList(int page = 1, int pageSize = 10)
        {
            var query = _context.CruiseLines.AsQueryable();

            var totalCount = await query.CountAsync();

            var cruiseShips = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var mappedShips = _mapper.Map<List<CruiseLineResponse>>(cruiseShips);

            return new PagedData<CruiseLineResponse>
            {
                Items = mappedShips,
                CurrentPage = page,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
            };
        }
        public async Task<List<IdNameModel<int>>> Get()
        {
            var lines = await _context.CruiseLines.ToListAsync();

            var cruiseLineList = lines.Select(line => new IdNameModel<int>
            {
                Id = line.Id,
                Name = line.Name
            }).ToList();

            return cruiseLineList;
        }
        public async Task<bool> Delete(int Id)
        {
            try
            {
                var entity = await _context.CruiseLines.FindAsync(Id);
                if (entity == null) return false;

                _context.CruiseLines.Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }



    }
}

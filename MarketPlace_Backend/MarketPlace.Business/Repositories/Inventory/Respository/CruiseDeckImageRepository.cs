using MarketPlace.Business.Repositories.Inventory.Interface;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

public class CruiseDeckImageRepository : ICruiseDeckImageRepository
{
    private readonly AppDbContext _context;

    public CruiseDeckImageRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(CruiseDeckImage entity)
    {
        await _context.CruiseDeckImages.AddAsync(entity);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<CruiseInventory?> GetByIdAsync(int id)
    {
        return await _context.CruiseInventories.FirstOrDefaultAsync(x => x.Id == id);
    }
}

using MarketPlace.Business.Repositories.Inventory.Interface;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using System.Collections.Generic;
using System.Threading.Tasks;

public class CruiseDeckImageRepository : ICruiseDeckImageRepository
{
    private readonly AppDbContext _context;
    public CruiseDeckImageRepository(AppDbContext context) { _context = context; }

    public async Task AddRangeAsync(List<CruiseDeckImage> deckImages)
    {
        await _context.CruiseDeckImages.AddRangeAsync(deckImages);
        await _context.SaveChangesAsync();
    }
}

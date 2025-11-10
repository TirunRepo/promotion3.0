using MarketPlace.DataAccess.Entities;
using MarketPlace.DataAccess.Entities.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Business.Repositories.Inventory.Interface
{
    public interface ICruiseDeckImageRepository
    {
        Task AddAsync(CruiseDeckImage entity);
        Task<CruiseInventory?> GetByIdAsync(int id);
        Task SaveChangesAsync();
    }
}

using AutoMapper;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.DataAccess.Entities;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Entities.Markup;
using MarketPlace.DataAccess.Entities.Promotions;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace MarketPlace.DataAccess.DBContext
{
    public class AppDbContext : DbContext
    {
        private readonly IMapper _mapper;

        public AppDbContext(DbContextOptions<AppDbContext> opts, IMapper mapper) : base(opts)
        {
            _mapper = mapper;
        }

        // DbSets
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<CruiseInventory> CruiseInventories { get; set; }
        public DbSet<InventoryRoleUpdateRequest> CruiseInventoriesRoleUpdate { get; set; }
        public DbSet<CruisePricing> CruisePricing { get; set; }
        public DbSet<CruiseCabin> CruiseCabin { get; set; }
        public DbSet<DeparturePort> DeparturePorts { get; set; }
        public DbSet<Destination> Destinations { get; set; }
        public DbSet<CruiseLine> CruiseLines { get; set; }  
        public DbSet<CruiseShip> CruiseShips { get; set; }
        public DbSet<Promotions> Promotions { get; set; }
        public DbSet<PromotionType> PromotionType { get; set; }
        public DbSet<MarkupDetail> MarkupDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<CruiseCabin>()
        .HasIndex(c => new { c.CruiseInventoryId, c.CabinNo })
        .IsUnique();

            // CruiseLine: Code unique
            modelBuilder.Entity<CruiseLine>()
                .HasIndex(c => c.Code)
                .IsUnique();

            // CruiseShip: Code unique
            modelBuilder.Entity<CruiseShip>()
                .HasIndex(s => s.Code)
                .IsUnique();

            // DeparturePort: Code unique
            modelBuilder.Entity<DeparturePort>()
                .HasIndex(p => p.Code)
                .IsUnique();

            // Destination: Code unique
            modelBuilder.Entity<Destination>()
                .HasIndex(d => d.Code)
                .IsUnique();

            // Promotions: PromoCode unique (only for non-null)
            modelBuilder.Entity<Promotions>()
                .HasIndex(p => p.PromoCode)
                .IsUnique()
                .HasFilter("[PromoCode] IS NOT NULL");

            // Optional: MarkupDetail uniqueness (adjust as needed)
            modelBuilder.Entity<MarkupDetail>()
                .HasIndex(m => new { m.GroupId, m.CategoryId, m.CabinOccupancy })
                .IsUnique();
        }

        public async Task<TRequest> SaveEntityAsync<TRequest, TEntity>(
      TRequest model,
      Expression<Func<TEntity, object>> uniquePropertySelector)
      where TEntity : class
        {
            // Extract property info
            var memberExpression = uniquePropertySelector.Body is UnaryExpression unary
                ? unary.Operand as MemberExpression
                : uniquePropertySelector.Body as MemberExpression;

            if (memberExpression == null)
                throw new InvalidOperationException("Invalid property selector");

            string propertyName = memberExpression.Member.Name;

            // Get value from DTO
            var dtoProperty = typeof(TRequest).GetProperty(propertyName)
                              ?? throw new InvalidOperationException($"DTO does not contain property '{propertyName}'.");

            var dtoValue = dtoProperty.GetValue(model)
                           ?? throw new InvalidOperationException($"The unique property '{propertyName}' cannot be null.");

            // Build predicate: e => e.Property == dtoValue
            var parameter = Expression.Parameter(typeof(TEntity), "e");
            var property = Expression.Property(parameter, propertyName);
            var constant = Expression.Constant(dtoValue);
            Expression body;

            if (dtoValue is string)
            {
                // Case-insensitive comparison
                var toLowerMethod = typeof(string).GetMethod("ToLower", Type.EmptyTypes)!;
                var left = Expression.Call(property, toLowerMethod);
                var right = Expression.Call(constant, toLowerMethod);
                body = Expression.Equal(left, right);
            }
            else
            {
                body = Expression.Equal(property, constant);
            }

            var predicate = Expression.Lambda<Func<TEntity, bool>>(body, parameter);

            // Check database only (ignore tracked entities)
            var existsInDb = await Set<TEntity>()
                .AsNoTracking()
                .AnyAsync(predicate);

            if (existsInDb)
                throw new InvalidOperationException("Duplicate entry detected.");

            // Map DTO -> Entity
            var entity = _mapper.Map<TEntity>(model);

            Set<TEntity>().Add(entity);
            await SaveChangesAsync();

            return _mapper.Map<TRequest>(entity);
        }

    }
}

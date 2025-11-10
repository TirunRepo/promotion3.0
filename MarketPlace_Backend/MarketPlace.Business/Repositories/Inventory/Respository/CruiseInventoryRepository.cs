using AutoMapper;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using MarketPlace.DataAccess.Repositories.Inventory.Interface;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.DataAccess.Repositories.Inventory.Respository
{
    public class CruiseInventoryRepository : ICruiseInventoryRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CruiseInventoryRepository(AppDbContext context, IMapper mapper)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }


        public async Task<CruiseInventoryModel> Insert(CruiseInventoryModel model)
        {
            try
            {
                var cruiseInventory = _mapper.Map<CruiseInventory>(model);
                _context.CruiseInventories.Add(cruiseInventory);
                await _context.SaveChangesAsync();
                return _mapper.Map<CruiseInventoryModel>(cruiseInventory);
            }
            catch (DbUpdateException dbEx)
            {
                // Log or inspect dbEx.InnerException.Message for more details
                throw new Exception($"DB Update failed: {dbEx.InnerException?.Message ?? dbEx.Message}", dbEx);
            }
        }
        public async Task<CruiseInventoryModel> Update(CruiseInventory model)
        {
            try
            {
                var cruiseInventory = _mapper.Map<CruiseInventory>(model);
                 _context.CruiseInventories.Update(cruiseInventory);
                await _context.SaveChangesAsync();
                return _mapper.Map<CruiseInventoryModel>(cruiseInventory);
            }
            catch (DbUpdateException dbEx)
            {
                // Log or inspect dbEx.InnerException.Message for more details
                throw new Exception($"DB Update failed: {dbEx.InnerException?.Message ?? dbEx.Message}", dbEx);
            }
        }
        public async Task<CruiseInventory?> GetByIdAsync(int id)
        {
            try
            {
              var cruiseInventory =  await _context.CruiseInventories.FindAsync(id);

              return cruiseInventory;
            }
            catch (DbUpdateException dbEx)
            {
                // Log or inspect dbEx.InnerException.Message for more details
                throw new Exception($"DB Update failed: {dbEx.InnerException?.Message ?? dbEx.Message}", dbEx);
            }
        }
        public async Task<PagedData<CruiseInventory>> GetPagedAsync(int page, int pageSize, string role, int? userId)
        {
            var query = _context.CruiseInventories.AsQueryable();

            // Admin role: show all inventories where EnableAdmin = true
            if (!string.IsNullOrEmpty(role) && role.Equals("admin", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(x => x.EnableAdmin);
            }
            else
            {
                // Agent or other roles: show only their own inventories
                if (userId != null)
                    query = query.Where(it => it.CreatedBy == userId);
            }

            var totalCount = await query.CountAsync();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var items = await query
                .OrderByDescending(x => x.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedData<CruiseInventory>
            {
                Items = items,
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };
        }


        //  UpdateRoles from interface
        public async Task<CruiseInventoryModel> UpdateRoles(InventoryRoleUpdateRequest roleInventoryUpdateRequest)
        {
            if (roleInventoryUpdateRequest == null)
                throw new ArgumentNullException(nameof(roleInventoryUpdateRequest));

            var inventory = await _context.CruiseInventories
                .FirstOrDefaultAsync(x => x.Id == roleInventoryUpdateRequest.Id);

            if (inventory == null)
                return null;

            //  Normalize role string
            var role = roleInventoryUpdateRequest.UserRole?.Trim().ToLower();

            if (role == "admin")
            {
                // Agent toggled admin status → only update EnableAdmin
                inventory.EnableAdmin = roleInventoryUpdateRequest.EnableAdmin;

                // Don't touch EnableAgent (keep existing)
                // Ensure agent inventory stays enabled
                if (!inventory.EnableAgent)
                    inventory.EnableAgent = true;
            }
            else if (role == "agent")
            {
                // Admin toggled agent side → only update EnableAgent
                inventory.EnableAgent = roleInventoryUpdateRequest.EnableAgent;

                // Don't touch admin setting
            }

                inventory.UpdatedOn = DateTime.UtcNow;
            inventory.UpdatedBy = roleInventoryUpdateRequest.UpdatedBy; 

            await _context.SaveChangesAsync();

            return _mapper.Map<CruiseInventoryModel>(inventory);
        }

        public async Task<PagedData<AgentInventoryReport>> GetAgentInventoryReportAsync(int agentId, int page, int pageSize)
        {
            try
            {
                var result = new List<AgentInventoryReport>();
                int totalCount = 0;

                using (var conn = _context.Database.GetDbConnection())
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();

                    using (var cmd = conn.CreateCommand())
                    {
                        cmd.CommandText = "sp_GetAgentInventoryReport";
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.Add(new SqlParameter("@AgentId", agentId));
                        cmd.Parameters.Add(new SqlParameter("@Page", page));
                        cmd.Parameters.Add(new SqlParameter("@PageSize", pageSize));

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var report = new AgentInventoryReport
                                {
                                    Id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    SailDate = reader.GetDateTime(reader.GetOrdinal("SailDate")),
                                    GroupId = reader["GroupId"]?.ToString(),
                                    CategoryId = reader["CategoryId"]?.ToString(),
                                    InventoryId = reader.GetInt32(reader.GetOrdinal("InventoryId")),
                                    AgentId = reader.GetInt32(reader.GetOrdinal("AgentId")),
                                    AgentName = reader["AgentName"]?.ToString(),
                                    ShipCode = reader["ShipCode"]?.ToString(),
                                    Stateroom = reader["Stateroom"]?.ToString(),
                                    CabinOccupancy = reader["CabinOccupancy"]?.ToString(),
                                    TotalCabins = reader.IsDBNull(reader.GetOrdinal("TotalCabins")) ? 0 : reader.GetInt32(reader.GetOrdinal("TotalCabins")),
                                    HoldCabins = reader.IsDBNull(reader.GetOrdinal("HoldCabins")) ? 0 : reader.GetInt32(reader.GetOrdinal("HoldCabins")),
                                    ConfirmCabins = reader.IsDBNull(reader.GetOrdinal("ConfirmCabins")) ? 0 : reader.GetInt32(reader.GetOrdinal("ConfirmCabins")),
                                    AvailableCabins = reader.IsDBNull(reader.GetOrdinal("AvailableCabins")) ? 0 : reader.GetInt32(reader.GetOrdinal("AvailableCabins")),
                                    BaseFare = reader.IsDBNull(reader.GetOrdinal("BaseFare")) ? 0 : reader.GetDecimal(reader.GetOrdinal("BaseFare")),
                                    MarkupMode = reader["MarkupMode"]?.ToString(),
                                    MarkUpPercentage = reader.IsDBNull(reader.GetOrdinal("MarkUpPercentage")) ? 0 : reader.GetDecimal(reader.GetOrdinal("MarkUpPercentage")),
                                    MarkUpFlatAmount = reader.IsDBNull(reader.GetOrdinal("MarkUpFlatAmount")) ? 0 : reader.GetDecimal(reader.GetOrdinal("MarkUpFlatAmount"))
                                };

                                result.Add(report);
                            }

                            if (await reader.NextResultAsync() && await reader.ReadAsync())
                            {
                                totalCount = reader.GetInt32(reader.GetOrdinal("TotalCount"));
                            }
                        }
                    }

                    await conn.CloseAsync();
                }

                return new PagedData<AgentInventoryReport>
                {
                    Items = result,
                    CurrentPage = page,
                    PageSize = pageSize,
                    TotalCount = totalCount,
                    TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize)
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Error fetching agent inventory report: {ex.Message}", ex);
            }
        }










    }
}

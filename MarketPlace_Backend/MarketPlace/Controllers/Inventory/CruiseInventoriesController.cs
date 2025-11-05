using MarketPlace.Business.Services.Interface;
using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Business.Services.Services.Inventory;
using MarketPlace.Common.APIResponse;
using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using MarketPlace.DataAccess.DBContext;
using MarketPlace.DataAccess.Entities.Inventory;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;    
using System.Collections.Generic;
using System.Security.Claims;

namespace Marketplace.API.Controllers.Inventory
{
    [ApiController]
    [Route("[controller]")]
    public class CruiseInventoriesController : ControllerBase
    {
        private readonly ICruiseInventoryService _cruiseInventoryService;
        private readonly ICruisePricingService _cruisePricingService;
        public readonly IUserRepository _userRepository;
        public readonly ICruiseCabinService _cruiseCabinService;
        
        public readonly AppDbContext _context;
        public CruiseInventoriesController(
            ICruiseInventoryService cruiseInventoryService,
            ICruisePricingService cruisePricingCabinService, IUserRepository userRepository, ICruiseCabinService cruiseCabinService, AppDbContext context)
        {
            _cruiseInventoryService = cruiseInventoryService;
            _cruisePricingService = cruisePricingCabinService;
            _userRepository = userRepository;
            _cruiseCabinService = cruiseCabinService;
            _context = context;
        }


        [HttpPost("CruiseInventory")]
        public async Task<IActionResult> SaveCruiseInventory([FromBody] CruiseInventoryRequest model) => await CruiseInventory(0, model);

        [HttpPost("CruiseInvemtory/update/{id}")]
        public async Task<IActionResult> UpdateCruiseInventory(int id,[FromBody] CruiseInventoryRequest model) => await CruiseInventory(id, model);
        private async Task<IActionResult> CruiseInventory(int id = 0,[FromBody] CruiseInventoryRequest model= null)
            {
            CruiseInventoryModel inventoryModel = new()
            {
                CategoryId = string.Empty,
                GroupId = string.Empty,
                Nights = string.Empty,
                Deck = string.Empty,
                Package = string.Empty,
                ShipCode = string.Empty,
                Stateroom = string.Empty
            };
            try
            {
                // Get the user ID from claims
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Retrieve the user from the repository
                var user = await _userRepository.GetByEmailAsync(userId!);
                if (user == null)
                {
                    return BadRequest(new APIResponse<CruiseInventoryModel>
                    {
                        Success = false,
                        Data = null,
                        Message = "Invalid user"
                    });
                }
                if(id == 0)
                {
                    // Set audit fields
                    model.CreatedBy = user.Id;
                    model.CreatedOn = DateTime.Now;

                    // Insert cruise inventory (returns CruiseInventoryModel)
                    inventoryModel = await _cruiseInventoryService.Insert(model);
                    if (inventoryModel == null)
                        throw new Exception("Something went wrong, please try again later.");
                }
                else
                {
                    // Set audit fields
                    model.UpdatedBy = user.Id;
                    model.UpdatedOn = DateTime.Now;

                    // Insert cruise inventory (returns CruiseInventoryModel)
                    inventoryModel = await _cruiseInventoryService.Update(id, model);
                    if (inventoryModel == null)
                        throw new Exception("Something went wrong, please try again later.");
                }

                    // (Optional) You might want to validate or log this result as well

                    // Return success response
                    return Ok(new APIResponse<CruiseInventoryModel>
                    {
                        Success = true,
                        Data = inventoryModel,
                        Message = "Cruise inventory, pricing, and cabins added successfully."
                    });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<CruiseInventoryModel>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("CruisePricing")]
        public async Task<IActionResult> SaveCruisePricing(CruisePricingModel model)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Retrieve the user from the repository
                var user = await _userRepository.GetByEmailAsync(userId!);
                if (user == null)
                {
                    return BadRequest(new APIResponse<CruiseInventoryModel>
                    {
                        Success = false,
                        Data = null,
                        Message = "Invalid user"
                    });
                }
                model.CreatedBy = user.Id;
                model.CreatedOn = DateTime.Now;
                var insertPricing = await _cruisePricingService.Insert(model);
                if (insertPricing == null)
                {
                    throw new Exception("Something went wrong, please try again later.");
                }
                return Ok(new APIResponse<CruisePricingModel>
                {
                    Success = true,
                    Data = insertPricing,
                    Message = "Cruise inventory, pricing, and cabins added successfully."
                });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<CruiseInventoryModel>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("CruisePricing/update/{id}")]
        public async Task<IActionResult> UpdateCruisePricing(int id, CruisePricingModel model)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Retrieve the user from the repository
                var user = await _userRepository.GetByEmailAsync(userId!);
                if (user == null)
                {
                    return BadRequest(new APIResponse<CruiseInventoryModel>
                    {
                        Success = false,
                        Data = null,
                        Message = "Invalid user"
                    });
                }
                model.UpdatedOn = DateTime.Now;
                model.UpdatedBy = user.Id;

                var cruisePricing = await _cruisePricingService.Update(id, model);
                if (cruisePricing == null)
                {
                    throw new Exception("Something went wrong, please try again later.");
                }
                return Ok(new APIResponse<CruisePricingModel>
                {
                    Success = true,
                    Data = cruisePricing,
                    Message = "Cruise inventory, pricing, and cabins added successfully."
                });
            }
            catch(Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<CruiseInventoryModel>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }
        [HttpPost("CruiseCabin")]
        public async Task<IActionResult> SaveCruiseCabin(List<CruiseCabinRequest> model)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Retrieve the user from the repository
                var user = await _userRepository.GetByEmailAsync(userId!);
                if (user == null)
                {
                    return BadRequest(new APIResponse<CruiseInventoryModel>
                    {
                        Success = false,
                        Data = null,
                        Message = "Invalid user"
                    });
                }
                model.First().CreatedBy = user.Id;
                model.First().CreatedOn = DateTime.Now;
                var insertCabin = await _cruiseCabinService.Insert(model);
                if (insertCabin == null)
                {
                    throw new Exception("Something went wrong, please try again later.");
                }
                return Ok(new APIResponse<List<CruiseCabinRequest>>
                {
                    Success = true,
                    Data = insertCabin,
                    Message = "Cruise inventory, pricing, and cabins added successfully."
                });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<CruiseInventoryModel>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("CruiseCabin/update/{id}")]
        public async Task<IActionResult> UpdateCruiseCabin(int id,List<CruiseCabinRequest> model)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                // Retrieve the user from the repository
                var user = await _userRepository.GetByEmailAsync(userId!);
                if (user == null)
                {
                    return BadRequest(new APIResponse<CruiseInventoryModel>
                    {
                        Success = false,
                        Data = null,
                        Message = "Invalid user"
                    });
                }
                model.First().UpdatedBy = user.Id;
                model.First().UpdatedOn = DateTime.Now;
                var udpateCabin = await _cruiseCabinService.Update(id,model);
                if (udpateCabin == null)
                {
                    throw new Exception("Something went wrong, please try again later.");
                }
                return Ok(new APIResponse<List<CruiseCabinRequest>>
                {
                    Success = true,
                    Data = udpateCabin,
                    Message = "Cruise inventory, pricing, and cabins added successfully."
                });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<CruiseInventoryModel>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetList(int page = 1, int pageSize = 10)
        {

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            // Retrieve the user from the repository
            var user = await _userRepository.GetByEmailAsync(userId!);
            var role = user?.Role; 
            var result = await _cruiseInventoryService.GetList(page, pageSize, role, user?.Id);
            return Ok(result);
        }

        [HttpGet("destination")]
        public async Task<IActionResult> GetDestination()
        {
            try
            {
                var dest = await _context.Destinations.ToListAsync();

                var list = dest.Select(x => new IdNameModel<int>()
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();

                return Ok(new APIResponse<List<IdNameModel<int>>>
                {
                    Success = true,
                    Data = list,
                    Message = "Cruise inventory, pricing, and cabins added successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<List<IdNameModel<int>>>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }

        [HttpGet("departureaCodeByDestination/{id}")]
        public async Task<ActionResult> GetDepartureCode(int id)
        {
            try
            {
                var departureCode = await _context.DeparturePorts.Where(x => x.DestinationId == id).ToListAsync();
                var list = departureCode.Select(x => new IdNameModel<int>()
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();

                return Ok(new APIResponse<List<IdNameModel<int>>>
                {
                    Success = true,
                    Data = list,
                    Message = "Cruise inventory, pricing, and cabins added successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<List<IdNameModel<int>>>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }

        [HttpGet("cruiseLine")]
        public async Task<IActionResult> GetCruiseLines()
        {
            try
            {
                var lines = await _context.CruiseLines.ToListAsync();

                var list = lines.Select(x => new IdNameModel<int>()
                {
                    Id = x.Id,
                    Name = x.Name
                }).ToList();

                return Ok(new APIResponse<List<IdNameModel<int>>>
                {
                    Success = true,
                    Data = list,
                    Message = "Cruise inventory, pricing, and cabins added successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<List<IdNameModel<int>>>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }


        [HttpGet("shipByCruiseLine/{id}")]
        public async Task<ActionResult> GetShip(int id)
        {
            try
            {
                var ships = await _context.CruiseShips.Where(x => x.CruiseLineId == id).ToListAsync();
                var list = ships.Select(x => new IdNameValueModel<string>()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Value = x.Code
                }).ToList();

                return Ok(new APIResponse<List<IdNameValueModel<string>>>
                {
                    Success = true,
                    Data = list,
                    Message = "Cruise inventory, pricing, and cabins added successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<List<IdNameValueModel<string>>>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCruiseInventory(int id)
        {
            try
            {
                var inventory = await _context.CruiseInventories.FirstOrDefaultAsync(x => x.Id == id);
                var cabins = await _context.CruiseCabin.Where(x => x.CruiseInventoryId == id).ToListAsync();
                var cruisePricing = await _context.CruisePricing.FirstOrDefaultAsync(x => x.CruiseInventoryId == id);

                _context.CruiseCabin.RemoveRange(cabins);  
                _context.CruisePricing.Remove(cruisePricing);
                _context.CruiseInventories.Remove(inventory);
                _context.SaveChanges();

                return Ok(new APIResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Message = "Cruise inventory, pricing, and cabins removed successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<bool>
                {
                    Success = false,
                    Data = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("cabin/{id}")]
        public async Task<IActionResult> DeleteCruiseCabin(int id, [FromBody] CabinDetails cabinDetails)
        {
            try
            {
                var inventory = await _context.CruiseInventories.FirstOrDefaultAsync(x => x.Id == id);
                var cabins = await _context.CruiseCabin.Where(x => x.CruiseInventoryId == id).ToListAsync();

                if(cabinDetails.CabinType == "GTY")
                {
                    var gtyCabins = cabins.Where(x => x.CabinType == "GTY");
                    if(!gtyCabins.Any())
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<bool>
                        {
                            Success = false,
                            Data = false,
                            Message = "GTY Cabin Not found."
                        });
                    }

                    var cabinCount = int.Parse(cabinDetails.CabinNo);
                    if (gtyCabins.Count() <= cabinCount)    
                    {
                        _context.CruiseCabin.RemoveRange(gtyCabins);
                    }
                    else
                    {
                        _context.CruiseCabin.RemoveRange(gtyCabins.ToList().OrderBy(x => x.CabinNo).Take(cabinCount));
                    }
                }
                else
                {
                    var cabin = cabins.Where(x => x.CabinNo == cabinDetails.CabinNo);
                    if (!cabin.Any())
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<bool>
                        {
                            Success = false,
                            Data = false,
                            Message = "Cabin Not found."
                        });
                    }
                    _context.CruiseCabin.RemoveRange(cabin);
                }

                _context.SaveChanges();

                return Ok(new APIResponse<bool>
                {
                    Success = true,
                    Data = true,
                    Message = "Cruise cabins removed successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<bool>
                {
                    Success = false,
                    Data = false,
                    Message = ex.Message
                });
            }
        }

        [HttpPost("UpdateRoles")]
        public async Task<IActionResult> UpdateInventoryRoles([FromBody] InventoryRoleUpdateRequest model)
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                var user = await _userRepository.GetByEmailAsync(userId!);
                if (user == null)
                {
                    return BadRequest(new APIResponse<CruiseInventoryModel>
                    {
                        Success = false,
                        Data = null,
                        Message = "Invalid user"
                    });
                }

                var updatedInventory = await _cruiseInventoryService.UpdateRoles(model);
                if (updatedInventory == null)
                {
                    return NotFound(new APIResponse<CruiseInventoryModel>
                    {
                        Success = false,
                        Data = null,
                        Message = "Inventory not found"
                    });
                }

                return Ok(new APIResponse<CruiseInventoryModel>
                {
                    Success = true,
                    Data = updatedInventory,
                    Message = "Inventory roles updated successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<CruiseInventoryModel>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }

        [HttpGet("GetManualCabin/{inventoryId}")]
        public async Task<ActionResult> GetManualCabin(int inventoryId)
        {
            try
            {
                // Query CruiseCabin table for the specific inventory and CabinType = 'Manual'
                var cabins = await _context.CruiseCabin
                    .Where(c => c.CruiseInventoryId == inventoryId && c.CabinType == "Manual")
                    .Select(c => new IdNameValueModel<string>()
                    {
                        Id = c.Id,
                        Name = c.CabinNo,   // Cabin number as Name
                        Value = c.CabinNo   // Or any other value you want to return
                    })
                    .ToListAsync();

                return Ok(new APIResponse<List<IdNameValueModel<string>>>
                {
                    Success = true,
                    Data = cabins,
                    Message = "Manual cabins fetched successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new APIResponse<List<IdNameValueModel<string>>>
                {
                    Success = false,
                    Data = null,
                    Message = ex.Message
                });
            }
        }

        [HttpGet("GetAgentInventoryReport")]
        public async Task<IActionResult> GetAgentInventoryReport(int agentId, int page = 1, int pageSize = 10)
        {
            try
            {
                var data = await _cruiseInventoryService.GetAgentInventoryReportAsync(agentId, page, pageSize);

                return Ok(new APIResponse<PagedData<AgentInventoryReport>>
                {
                    Success = true,
                    Message = "Agent inventory report generated successfully.",
                    Data = data
                });
            }
            catch (Exception ex)
            {
                // Handle known errors from repository/service
                return BadRequest(new APIResponse<string>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                });
            }
        }

        [HttpGet("GetByCruiseInventoryId")]
        public async Task<ActionResult> GetByCruiseInventoryId(int cruiseInventoryId)
        {
            var data = await _cruisePricingService.GetByCruiseInventoryId(cruiseInventoryId);

            if (data == null)
                return NotFound(APIResponse<CruisePricing>.Fail($"Cruise Pricing Against CruiseInventoryId : {cruiseInventoryId}  Not Found."));

            return Ok(APIResponse<CruisePricing>.Ok(data));
        }

    }
}

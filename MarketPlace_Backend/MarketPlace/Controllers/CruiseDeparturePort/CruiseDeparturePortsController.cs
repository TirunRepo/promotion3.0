using MarketPlace.Business.Services.Interface;
using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Business.Services.Services.Inventory;
using MarketPlace.Common.APIResponse;
using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Marketplace.API.Controllers.CruiseDeparturePort
{
    [ApiController]
    [Route("[controller]")]
    public class CruiseDeparturePortsController : ControllerBase
    {
        private readonly IDeparturePortService _departurePortService;
        public readonly IDestinationService _destinationService;
        public readonly IUserRepository _userRepository;

        public CruiseDeparturePortsController(
            IDeparturePortService departurePortService,
            IDestinationService destinationService, IUserRepository userRepository)
        {
            _departurePortService = departurePortService;
            _destinationService = destinationService;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetShips(int page = 1, int pageSize = 10)
        {
            if (page <= 0 || pageSize <= 0)
            {
                return BadRequest(new APIResponse<PagedData<CruiseDeparturePortResponse>>
                {
                    Success = false,
                    Data = null,
                    Message = "Page and pageSize must be greater than zero."
                });
            }

            var pagedShips = await _departurePortService.GetList(page, pageSize);

            return Ok(new APIResponse<PagedData<CruiseDeparturePortResponse>>
            {
                Success = true,
                Data = pagedShips,
                Message = "Cruise ships retrieved successfully."
            });
        }

        // POST: api/CruiseShips
        [HttpPost]
        public async Task<IActionResult> AddShip([FromBody] DeparturePortRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new APIResponse<DeparturePortRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Invalid model data."
                });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userRepository.GetByEmailAsync(userId!);
            if (user == null)
            {
                return BadRequest(new APIResponse<DeparturePortRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Invalid user"
                });
            }

            model.CreatedBy = user.Id;
            model.CreatedOn = DateTime.Now;
            var result = await _departurePortService.Insert(model);

            if (result != null)
            {
                var response = new APIResponse<DeparturePortRequest>
                {
                    Success = true,
                    Data = result,
                    Message = "Cruise line added successfully."
                };

                return Ok(response); // ✅ simple success response
            }

            return StatusCode(StatusCodes.Status500InternalServerError,
                new APIResponse<DeparturePortRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Failed to add cruise line."
                });
        }

        [HttpPost("update/{id}")]
        public async Task<IActionResult> UpdateShips(int Id, [FromBody] DeparturePortRequest model)
        {
            if (model == null)
            {
                return BadRequest(new APIResponse<DeparturePortRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Cruise line data is required."
                });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new APIResponse<DeparturePortRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "User not authorized."
                });
            }
            var line = await _departurePortService.GetById(Id);
            var user = await _userRepository.GetByEmailAsync(userId!);
            if (user == null)
            {
                return BadRequest(new APIResponse<DeparturePortRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Invalid user"
                });
            }

            model.CreatedBy = line.CreatedBy;
            model.CreatedOn = line.CreatedOn;
            model.UpdatedBy = user.Id;
            model.UpdatedOn = DateTime.Now;


            var updated = await _departurePortService.Update(Id, model);

            if (updated == null)
            {
                return NotFound(new APIResponse<DeparturePortRequest>
                {
                    Success = false,
                    Data = null,
                    Message = $"Cruise line with ID {Id} not found."
                });
            }

            return Ok(new APIResponse<DeparturePortRequest>
            {
                Success = true,
                Data = updated,
                Message = "Cruise line updated successfully."
            });
        }
        // DELETE: api/Ships/5
        [HttpDelete("{id:int}")]
        public async Task<bool> DeleteShip(int id)
        {
            try
            {

                var line = await _departurePortService.GetById(id);
                if (line == null)
                {
                    return false; // not found
                }


                return await _departurePortService.Delete(id); ; // deleted successfully
            }
            catch
            {
                return false; // error occurred
            }

        }
        [HttpGet("Destination")]
        public async Task<List<IdNameModel<int>>> Get()
        {
            return await _destinationService.Get();
        }
    }
}

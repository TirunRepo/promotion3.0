using MarketPlace.Business.Services.Interface;
using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Common.APIResponse;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.ResponseModels.Inventory;
using MarketPlace.Common.PagedData;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Marketplace.API.Controllers.CruiseLines
{
    [ApiController]
    [Route("[controller]")]
    public class CruiseLinesController : ControllerBase
    {
        private readonly ICruiseLineService _cruiseLineService;
        private readonly IUserRepository _userRepository;

        public CruiseLinesController(ICruiseLineService cruiseLineService,IUserRepository userRepository)
        {
            _cruiseLineService = cruiseLineService;
            _userRepository = userRepository;
        }

        /// <summary>
        /// Get List of lines
        /// </summary>
        /// <param name="page"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        [HttpGet]
        public async Task<ActionResult<PagedData<CruiseLineResponse>>> GetList(int page = 1, int pageSize = 10)
        {

            if (page <= 0 || pageSize <= 0)
            {
                return BadRequest(new APIResponse<PagedData<CruiseLineResponse>>
                {
                    Success = false,
                    Data = null,
                    Message = "Page and pageSize must be greater than zero."
                });
            }

            var pagedShips = await _cruiseLineService.GetList(page, pageSize);

            return Ok(new APIResponse<PagedData<CruiseLineResponse>>
            {
                Success = true,
                Data = pagedShips,
                Message = "Cruise ships retrieved successfully."
            });
        }

        // POST: api/CruiseLines
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] CruiseLineRequest model)
        {
            if (!ModelState.IsValid)
                return BadRequest(new APIResponse<CruiseLineRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Invalid model data."
                });

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userRepository.GetByEmailAsync(userId!);
            if(user == null) 
            {
                return BadRequest(new APIResponse<CruiseLineRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Invalid user"
                });
            }
            model.CreatedBy = user.Id;
            model.CreatedOn = DateTime.Now;
            var result = await _cruiseLineService.Insert(model);

            if (result != null)
            {
                var response = new APIResponse<CruiseLineRequest>
                {
                    Success = true,
                    Data = result,
                    Message = "Cruise line added successfully."
                };

                return Ok(response); // ✅ simple success response
            }

            return StatusCode(StatusCodes.Status500InternalServerError,
                new APIResponse<CruiseLineRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Failed to add cruise line."
                });
        }

        [HttpPost("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CruiseLineRequest model)
        {
            if (model == null)
            {
                return BadRequest(new APIResponse<CruiseLineRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Cruise line data is required."
                });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new APIResponse<CruiseLineRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "User not authorized."
                });
            }
            var line = await _cruiseLineService.GetById(id);
            var user = await _userRepository.GetByEmailAsync(userId!);
            if (user == null)
            {
                return BadRequest(new APIResponse<CruiseLineRequest>
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


            var updated = await _cruiseLineService.Update(id, model);

            if (updated == null)
            {
                return NotFound(new APIResponse<CruiseLineRequest>
                {
                    Success = false,
                    Data = null,
                    Message = $"Cruise line with ID {id} not found."
                });
            }

            return Ok(new APIResponse<CruiseLineRequest>
            {
                Success = true,
                Data = updated,
                Message = "Cruise line updated successfully."
            });
        }


        [HttpPost("{id}")]
        public async Task<bool> Delete(int id)
        {
            try
            {
                var line = await _cruiseLineService.GetById(id);
                if (line == null)
                {
                    return false; // not found
                }

                return await _cruiseLineService.Delete(id); ; // deleted successfully
            }
            catch
            {
                return false; // error occurred
            }
        }



    }
}

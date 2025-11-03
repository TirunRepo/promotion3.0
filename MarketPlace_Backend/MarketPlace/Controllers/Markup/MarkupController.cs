using MarketPlace.Business.Services.Interface;
using MarketPlace.Business.Services.Interface.MarkUps;
using MarketPlace.Common.APIResponse;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using MarketPlace.Common.DTOs.RequestModels.Markup;
using MarketPlace.Common.DTOs.ResponseModels.Markup;
using MarketPlace.Common.PagedData;
using MarketPlace.Infrastucture.Markup.Commands.CalculateMarkup;
using MarketPlace.Infrastucture.Markup.Commands.CreateMarkup;
using MarketPlace.Infrastucture.Markup.Commands.DeleteMarkup;
using MarketPlace.Infrastucture.Markup.Commands.UpdateMarkup;
using MarketPlace.Infrastucture.Markup.Queries.GetAllMarkups;
using MarketPlace.Infrastucture.Markup.Queries.GetMarkupById;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Marketplace.API.Controllers.Markup
{
    [Route("[controller]")]
    [ApiController]
    public class MarkupController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMarkupsService _markups;
        private readonly IUserRepository _userRepository;

        public MarkupController(IMediator mediator, IMarkupsService markups, IUserRepository userRepository)
        {
            _mediator = mediator;
            _markups = markups;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse<MarkupResponse>>> Create([FromBody] MarkupRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userRepository.GetByEmailAsync(userId!);
            if (user == null)
            {
                return BadRequest(new APIResponse<CruiseShipRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Invalid user"
                });
            }
            bool exists = await _markups.CheckDuplicateMarkup(
            request.SailDate,
            request.GroupId,
            request.CategoryId,
            request.CabinOccupancy
             );

            if (exists)
                return Conflict(APIResponse<MarkupResponse>.Fail("Markup already exists for this sail date, group, category, and occupancy."));


            request.CreatedBy = user.Id;
            request.CreatedOn = DateTime.Now;
            try
            {
                var result = await _mediator.Send(new CreateMarkupCommand(request));
                return Created("", APIResponse<MarkupResponse>.Ok(result, "Markup created successfully."));
            }
            catch (Exception ex)
            {
                return StatusCode(500, APIResponse<MarkupResponse>.Fail("An unexpected error occurred: " + ex.Message));
            }
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<APIResponse<MarkupResponse>>> Get(int id)
        {
            var result = await _mediator.Send(new GetMarkupByIdQuery(id));
            if (result == null)
                return NotFound(APIResponse<MarkupResponse>.Fail("Markup not found."));
            return Ok(APIResponse<MarkupResponse>.Ok(result));
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse<PagedData<MarkupResponse>>>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var allMarkups = await _mediator.Send(new GetAllMarkupsQuery());

            var totalCount = allMarkups.Count();
            var totalPages = (int)Math.Ceiling(totalCount / (double)pageSize);

            var pagedItems = allMarkups
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var pagedData = new PagedData<MarkupResponse>
            {
                Items = pagedItems,
                CurrentPage = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = totalPages
            };

            return Ok(APIResponse<PagedData<MarkupResponse>>.Ok(pagedData));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<APIResponse<MarkupResponse>>> Update(int id, [FromBody] MarkupRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await _userRepository.GetByEmailAsync(userId!);
            if (user == null)
            {
                return BadRequest(new APIResponse<CruiseShipRequest>
                {
                    Success = false,
                    Data = null,
                    Message = "Invalid user"
                });
            }
            request.UpdatedBy = user.Id;
            request.UpdatedOn = DateTime.Now;
            var result = await _mediator.Send(new UpdateMarkupCommand(request));
            return Ok(APIResponse<MarkupResponse>.Ok(result, "Markup updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<APIResponse<string>>> Delete(int id)
        {
            await _mediator.Send(new DeleteMarkupCommand(id));
            return Ok(APIResponse<string>.Ok("Markup deleted successfully."));
        }

        [HttpPost("calculate-markup")]
        public async Task<IActionResult> CalculateDiscount([FromBody] MarkupCalculationRequest request)
        {
            var result = await _mediator.Send(new CalculateMarkupCommand(request));
            return Ok(result);
        }

        [HttpGet("SailDates")]
        public async Task<ActionResult> GetSailingDates()
        {
            var sailingdates = await _markups.GetSailDate();
            return Ok(sailingdates);
        }

        [HttpGet("groupId")]
        public async Task<ActionResult> GetGroupId(DateTime sailDate)
        {
            var groupId = await _markups.GetGroupId(sailDate);
            return Ok(groupId);
        }

        [HttpGet("CategoryId")]
        public async Task<ActionResult> GetCategoryId(DateTime saildate, string groupId)
        {
            var categoryId = await _markups.GetCategoryId(saildate, groupId);
            return Ok(categoryId);
        }

        [HttpGet("CabinOccupancy")]
        public async Task<ActionResult> GetCabinOccupany(int id)
        {
            var cabinOccupancy = await _markups.GetCabinOccupancy(id);
            return Ok(cabinOccupancy);
        }

        [HttpGet("Promotions")]
        public async Task<ActionResult> GetPromotionDetails(DateTime sailDate, string groupId, int destinationId, int cruiseLineId)
        {
            var promotions = await _markups.GetPromotionDetails(sailDate, groupId, destinationId, cruiseLineId);
            return Ok(promotions);
        }

        [HttpGet("ShipDetails")]
        public async Task<ActionResult> GetShipDetails(int id)
        {
            var shipDetails = await _markups.GetShipDetails(id);
            return Ok(shipDetails);
        }
    }

}

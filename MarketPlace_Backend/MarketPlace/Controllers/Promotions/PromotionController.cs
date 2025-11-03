using MarketPlace.Business.Services.Interface.Promotions;
using MarketPlace.Common.APIResponse;
using MarketPlace.Common.DTOs.RequestModels.Promotions;
using MarketPlace.Common.DTOs.ResponseModels.Promotions;
using MarketPlace.Infrastucture.Promotion.Commands.CalculatePromotion;
using MarketPlace.Infrastucture.Promotion.Commands.CreatePromotion;
using MarketPlace.Infrastucture.Promotion.Commands.UpdatePromotion;
using MarketPlace.Infrastucture.Promotion.Queries.GetPromotionById;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promotion.Infrastructure.Queries;

namespace Marketplace.API.Controllers.Promotions
{
    [ApiController]
    [Route("[controller]")]
    [Authorize]
    public class PromotionController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IPromotionService _promotionsService;

        public PromotionController(IMediator mediator,IPromotionService promotionService)
        {
            _mediator = mediator;
            _promotionsService = promotionService;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse<PromotionResponse>>> Create([FromBody] PromotionRequest request)
        {
            var result = await _mediator.Send(new CreatePromotionCommand(request));
            return Created("", APIResponse<PromotionResponse>.Ok(result, "Promotion created successfully."));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<APIResponse<PromotionResponse>>> Get(int id)
        {
            var result = await _mediator.Send(new GetPromotionByIdQuery(id));
            if (result == null)
                return NotFound(APIResponse<PromotionResponse>.Fail("Promotion not found."));
            return Ok(APIResponse<PromotionResponse>.Ok(result));
        }

        [HttpGet]
        public async Task<ActionResult<APIResponse<List<PromotionResponse>>>> GetAll()
        {
            var result = await _mediator.Send(new GetAllPromotionsQuery());
            return Ok(APIResponse<List<PromotionResponse>>.Ok(result));
        }

        [HttpPut]
        public async Task<ActionResult<APIResponse<PromotionResponse>>> Update([FromBody] PromotionRequest request)
        {
            var result = await _mediator.Send(new UpdatePromotionCommand(request));
            return Ok(APIResponse<PromotionResponse>.Ok(result, "Promotion updated successfully."));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<APIResponse<string>>> Delete(int id)
        {
            await _mediator.Send(new DeletePromotionCommand(id));
            return Ok(APIResponse<string>.Ok("Promotion deleted successfully."));
        }

        [HttpPost("calculate-discount")]
        public async Task<IActionResult> CalculateDiscount([FromBody] PromotionCalculationRequest request)
        {
            var result = await _mediator.Send(new CalculatePromotionCommand(request));
            return Ok(result);
        }

        [HttpGet("PromotionType")]
        public async Task<ActionResult> GetPromotionType()
        {
            var promotionType = await _promotionsService.GetPromotionType();
            return Ok(promotionType);
        }
        [HttpGet("SailDates")]
        public async Task<ActionResult> GetSailingDates()
        {
            var sailingdates = await _promotionsService.GetSailDate();
            return Ok(sailingdates);
        }
        [HttpGet("DestinationBySailDate")]
        public async Task<ActionResult> GetDestinationBySailDate(DateTime sailDate)
        {
            var destination = await _promotionsService.GetDestinationBySailDate(sailDate);

            return Ok(destination);
        }

        [HttpGet("CruiseLineBySailDate")]
        public async Task<ActionResult> GetCruiseLineBySailDate(DateTime sailDate)
        {
            var cruiseline = await _promotionsService.GetCruiseLineBySailDate(sailDate);
            return Ok(cruiseline);
        }
        [HttpGet("GroupIdBySailDate")]
        public async Task<ActionResult> GetGroupIdBySailDate(DateTime sailDate)
        {
            var cruiseline = await _promotionsService.GetGroupIdBySailDate(sailDate);
            return Ok(cruiseline);
        }
    }
}

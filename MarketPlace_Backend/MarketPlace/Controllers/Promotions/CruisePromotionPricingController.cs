using MarketPlace.Business.Services.Interface.Inventory;
using MarketPlace.Common.APIResponse;
using MarketPlace.DataAccess.Entities.Inventory;
using Microsoft.AspNetCore.Mvc;

namespace Marketplace.API.Controllers.Promotions
{
    [Route("api/[controller]")]
    [ApiController]
    public class CruisePromotionPricingController : ControllerBase
    {
        private readonly ICruisePromotionPricingService _cruisePromotionPricingService;
        public CruisePromotionPricingController(ICruisePromotionPricingService cruisePromotionPricingService) 
        {
            _cruisePromotionPricingService = cruisePromotionPricingService;
        }

        [HttpGet("GetById")]
        public async Task<ActionResult<APIResponse<CruisePromotionPricing>>> GetById(int Id)
        {
            var data = await _cruisePromotionPricingService.GetByIdAsync(Id);

            if (data == null)
                return NotFound(APIResponse<CruisePromotionPricing>.Fail("Cruise Promotion Pricing Not Found."));

            return Ok(APIResponse<CruisePromotionPricing>.Ok(data));
        }

        [HttpGet("GetByCruiseInventory")]
        public async Task<ActionResult<APIResponse<CruisePromotionPricing>>> GetByCruiseInventory(int CruiseInventoryId)
        {
            var data = await _cruisePromotionPricingService.GetByCruiseInventoryAsync(CruiseInventoryId);

            if (data == null)
                return NotFound(APIResponse<List<CruisePromotionPricing>>.Fail($"Cruise Promotion Pricing Against CruiseInventoryId : {CruiseInventoryId}  Not Found."));

            return Ok(APIResponse<List<CruisePromotionPricing>>.Ok(data));
        }

        [HttpPost("Insert")]
        public async Task<ActionResult<APIResponse<CruisePromotionPricing>>> Insert(CruisePromotionPricing CruisePromotionPricing)
        {
            var data = await _cruisePromotionPricingService.InsertAsync(CruisePromotionPricing);

            if (data == null)
                return NotFound(APIResponse<CruisePromotionPricing>.Fail($"Cruise Promotion Pricing Not Inserted."));

            return Ok(APIResponse<CruisePromotionPricing>.Ok(data));
        }

        [HttpPut("Update")]
        public async Task<ActionResult<APIResponse<CruisePromotionPricing>>> Update(CruisePromotionPricing CruisePromotionPricing)
        {
            var data = await _cruisePromotionPricingService.InsertAsync(CruisePromotionPricing);

            if (data == null)
                return NotFound(APIResponse<CruisePromotionPricing>.Fail($"Cruise Promotion Pricing Not Updated."));

            return Ok(APIResponse<CruisePromotionPricing>.Ok(data));
        }

        [HttpDelete("Delete")]
        public async Task<ActionResult<APIResponse<CruisePromotionPricing>>> Delete(int Id)
        {
            await _cruisePromotionPricingService.DeleteAsync(Id);

            return Ok(APIResponse<string>.Ok("Cruise Promotion Pricing Deleted Successfully."));
        }

    }
}

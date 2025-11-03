
using MarketPlace.Common.CommonModel;

namespace MarketPlace.Common.DTOs.RequestModels.Inventory
{
    public class CruiseShipRequest :RecordBase
    {
        public int? Id { get; set; }
        public required string Name { get; set; }
        public required string Code { get; set; }
        public required int CruiseLineId { get; set; }
    }
}

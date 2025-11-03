using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.RequestModels.Promotions
{
    public class PromotionCalculationRequest
    {
        public decimal BaseFare { get; set; }
        public DateTime BookingDate { get; set; }
        public List<string>? PromoCodes { get; set; }
        public List<PassengerRequestModel> Passengers { get; set; } = new();
        public bool IsFirstTimeCustomer { get; set; }
        public string? LoyaltyLevel { get; set; }
        public int CabinCount { get; set; }
        public int? SailingId { get; set; }
        public int? SupplierId { get; set; }
    }

    public class PassengerRequestModel
    {
        public string Gender { get; set; }
        public int Age { get; set; }
        public decimal BaseFare { get; set; }
        public string RoomType { get; set; }
    }
}

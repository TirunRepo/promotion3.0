using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.ResponseModels.Promotions
{
    public class PromotionCalculationResponse
    {
        public int Id { get; set; }
        public string PromotionName { get; set; }
        public string PromotionDescription { get; set; }
        public string PromoCode { get; set; }
        public bool IncludesAirfare { get; set; }
        public bool IncludesHotel { get; set; }
        public bool IncludesWiFi { get; set; }
        public bool IncludesShoreExcursion { get; set; }
        public bool IsStackable { get; set; }
        public decimal OnboardCreditAmount { get; set; }
        public decimal TotalBaseFare { get; set; }
        public decimal TotalDiscount { get; set; }
        public decimal TotalFare { get; set; }
        public List<PassengerDetails> Passengers { get; set; }
    }

    public class PassengerDetails
    {
        public int Age { get; set; }
        public decimal BaseFare { get; set; }
        public string RoomType { get; set; }
        public decimal Discount { get; set; }
        public decimal Fare { get; set; }
        public string Gender { get; set; }
    }
}

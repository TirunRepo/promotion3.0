using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.ResponseModels.Promotions
{
    public class PromotionResponse
    {
        public int Id { get; set; }
        public int PromotionTypeId { get; set; }
        public string PromotionType { get; set; }
        public string PromotionName { get; set; } = string.Empty;
        public string PromotionDescription { get; set; } = string.Empty;
        public decimal? DiscountPer { get; set; }

        public decimal? DiscountAmount { get; set; }

        public string? ValueType { get; set; }
        public string? PromoCode { get; set; }
        public string? LoyaltyLevel { get; set; }

        public bool? IsFirstTimeCustomer { get; set; }
        public int? MinNoOfAdultRequired { get; set; }
        public int? MinNoOfChildRequired { get; set; }

        public bool? IsAdultTicketDiscount { get; set; }
        public bool? IsChildTicketDiscount { get; set; }

        public int? MinPassengerAge { get; set; }
        public int? MaxPassengerAge { get; set; }
        public string? PassengerType { get; set; }

        public int? CabinCountRequired { get; set; }
        public int? SailingId { get; set; }
        public int? SupplierId { get; set; }
        public string? AffiliateName { get; set; }

        public bool? IncludesAirfare { get; set; }
        public bool? IncludesHotel { get; set; }
        public bool? IncludesWiFi { get; set; }
        public bool? IncludesShoreExcursion { get; set; }

        public decimal? OnboardCreditAmount { get; set; }

        public DateTime StartDate { get; set; } = new DateTime();
        public DateTime EndDate { get; set; }

        public bool? IsStackable { get; set; }
        public bool IsActive { get; set; }

        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? ModifyBy { get; set; }
        public DateTime? ModifyDate { get; set; }
        public string CalculatedOn { get; set; } = String.Empty;
        public string? DiscountType { get; set; }
        public bool IsBOGO { get; set; }
    }
}

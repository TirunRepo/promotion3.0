using MarketPlace.Common.CommonModel;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace MarketPlace.DataAccess.Entities.Promotions
{
    public class Promotions : RecordBase
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("PromotionType")]
        public int PromotionTypeId { get; set; }
        [Required]
        public required string PromotionName { get; set; }
        [Required]
        public required string PromotionDescription { get; set; }
        [Column(TypeName = "decimal(5,2)")]
        public decimal? DiscountPer { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal? DiscountAmount { get; set; }
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
        public DateTime? SailDate { get; set; }
        public string GroupId { get; set; }
        public int? DestinationId { get; set; }
        public int? CruiseLineId { get; set; }

        public int? CruiseShipId { get; set; }
        public string? AffiliateName { get; set; }
        public bool? IncludesAirfare { get; set; }
        public bool? IncludesHotel { get; set; }
        public bool? IncludesWiFi { get; set; }
        public bool? IncludesShoreExcursion { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal? OnboardCreditAmount { get; set; }
        public int? FreeNthPassenger { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        [DefaultValue("false")]
        public bool? IsStackable { get; set; }
        [DefaultValue("true")]
        public bool IsActive { get; set; }
        public string CalculatedOn { get; set; } = String.Empty;
        public string? DiscountType { get; set; }
        public bool IsBOGO { get; set; }
    }
}

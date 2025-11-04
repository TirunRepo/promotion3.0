using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketPlace.DataAccess.Entities.Inventory
{
    public class CruisePromotionPricing
    {
        [Key]
        public int Id { get; set; }
        public int PromotionId { get; set; }
        public int CruiseInventoryId { get; set; }
        public required string PricingType { get; set; }
        public int CommisionRate { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? SinglePrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? DoublePrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? TriplePrice { get; set; }

        public string CurrencyType { get; set; }
        public required string CabinOccupancy { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Tax { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Grats { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal Nccf { get; set; }
        public decimal CommisionSingleRate { get; set; }
        public decimal CommisionDoubleRate { get; set; }
        public decimal CommisionTripleRate { get; set; }
        public decimal TotalPrice { get; set; }
    }
}

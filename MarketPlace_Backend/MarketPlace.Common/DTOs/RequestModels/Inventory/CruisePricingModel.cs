using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.RequestModels.Inventory
{
    public class CruisePricingModel : RecordBase
    {
        public int CruiseInventoryId { get; set; }
        public required string PricingType { get; set; }
        public int CommisionRate { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal? SinglePrice { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal? DoublePrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? TriplePrice { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Tax { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Grats { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Nccf { get; set; }

        public string CurrencyType { get; set; }

        public required string CabinOccupancy { get; set; }

    }
}

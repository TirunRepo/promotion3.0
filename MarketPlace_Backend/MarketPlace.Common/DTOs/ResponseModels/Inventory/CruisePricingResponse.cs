using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.ResponseModels.Inventory
{
    public class CruisePricingResponse : RecordBase
    {
        public int? Id { get; set; }
        public int? CruiseInventoryId { get; set; }
        public string? PricingType { get; set; }
        public int? CommisionRate { get; set; }

        public decimal? SinglePrice { get; set; }

        public decimal? DoublePrice { get; set; }

        public decimal? TriplePrice { get; set; }

        public decimal? Tax { get; set; }

        public decimal? Grats { get; set; }

        public decimal? Nccf { get; set; }
        public string CurrencyType { get; set; }
         public decimal?   CommisionSingleRate { get; set; }
         public decimal? CommisionDoubleRate { get; set; }
         public decimal? CommisionTripleRate { get; set; }
        public required string CabinOccupancy { get; set; }
        public decimal TotalPrice { get; set; }

    }

}

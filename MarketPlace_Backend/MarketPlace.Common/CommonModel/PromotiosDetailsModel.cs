using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.CommonModel
{
    public class PromotiosDetailsModel
    {

        public string PromotionName { get; set; }
        public decimal? DiscountPercentage { get; set; } 
        public decimal? DiscountAmount { get; set; } 
    }
}

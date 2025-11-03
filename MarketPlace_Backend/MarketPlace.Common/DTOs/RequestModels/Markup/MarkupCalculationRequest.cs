using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.RequestModels.Markup
{
    public class MarkupCalculationRequest
    {
        public int? SupplierId { get; set; }
        public int? SailingId { get; set; }
        public decimal BaseFare { get; set; }
        public DateTime BookingDate { get; set; }
    }
}

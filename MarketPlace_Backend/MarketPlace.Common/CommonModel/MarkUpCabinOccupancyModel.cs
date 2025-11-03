using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.CommonModel
{
    public class MarkUpCabinOccupancyModel
    {
        public string CabinOccupancy {  get; set; }

        public decimal? SingleRate { get; set; }
        public decimal? DoubleRate { get; set; }
        public decimal? TripleRate { get; set; }
        public decimal? Nccf { get; set; }

        public decimal? Tax { get; set; }
        public decimal? Grats { get; set; }

    }
}

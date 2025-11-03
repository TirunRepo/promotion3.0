using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.CommonModel
{
    public class ShipDetailsModel
    {
        public IdNameModel<int> Ship { get; set; }
        public IdNameModel<int> CruiseLine { get; set; }
        public IdNameModel<int> Destination { get; set; }
    }
}

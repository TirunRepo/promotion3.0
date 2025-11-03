using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.ResponseModels.Inventory
{
    public class CruiseLineResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public string Code { get; set; }
    }

    public class CruiseLineModal: RecordBase
    {
        public string Name { get; set; }
        public string Code { get; set; }
    }
}

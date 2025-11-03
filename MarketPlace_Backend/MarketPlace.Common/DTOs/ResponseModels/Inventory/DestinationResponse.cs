using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.ResponseModels.Inventory
{
    public class DestinationResponse : RecordBase
    {
        public int? Id { get; set; }

        public required string Code { get; set; }
        public required string Name { get; set; }
    }
}

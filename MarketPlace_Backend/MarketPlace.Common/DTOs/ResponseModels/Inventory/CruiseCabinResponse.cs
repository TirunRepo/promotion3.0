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
    public class CruiseCabinResponse :RecordBase
    {
        public int CruiseInventoryId { get; set; }

        public int Id { get; set; }
        public required string CabinNo { get; set; }
        public required string CabinType { get; set; }

        public required string CabinOccupancy { get; set; }
    }
}

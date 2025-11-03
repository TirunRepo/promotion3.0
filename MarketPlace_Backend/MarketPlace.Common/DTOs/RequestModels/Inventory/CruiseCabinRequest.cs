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
    public class CruiseCabinRequest :RecordBase
    {
        public int? CruiseInventoryId { get; set; }
        public int Id { get; set; }
        public string CabinNo { get; set; }
        public string CabinType { get; set; }

        public string CabinOccupancy { get; set; }

        public bool IsRemoveCabin { get; set; }
    }
}

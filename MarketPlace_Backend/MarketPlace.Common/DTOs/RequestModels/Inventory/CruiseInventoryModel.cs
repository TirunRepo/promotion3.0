using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.RequestModels.Inventory
{
    public class CruiseInventoryModel : RecordBase
    {

        public int? Id { get; set; }
        [Required]
        public DateTime SailDate { get; set; }
        [Required, StringLength(100)]
        public required string GroupId { get; set; }
        [Required, StringLength(500)]
        public required string Package { get; set; }
        public required string Nights { get; set; }
        public required string Deck { get; set; }

        public int DestinationId { get; set; }

        public int DeparturePortId { get; set; }

        public int CruiseLineId { get; set; }
        public int CruiseShipId { get; set; }
        public required string ShipCode { get; set; }

        public required string CategoryId { get; set; }
        public required string Stateroom { get; set; }


        public bool EnableAdmin { get; set; } = false;
        public bool EnableAgent { get; set; } = false;
    }

}

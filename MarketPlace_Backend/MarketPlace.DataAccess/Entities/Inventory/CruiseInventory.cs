using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.DataAccess.Entities.Inventory
{
    public class CruiseInventory :RecordBase
    {
        [Key]
        public int Id { get; set; }

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

        public int CruiseLineId { get;set; }
         public int CruiseShipId { get; set; }
        public required string ShipCode { get; set; }

        public required string CategoryId { get; set; }
        public required string Stateroom { get; set; }

        public bool EnableAdmin { get; set; }
        public bool EnableAgent { get; set; }

    }
}

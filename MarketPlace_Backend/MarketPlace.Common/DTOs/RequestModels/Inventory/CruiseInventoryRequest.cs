using MarketPlace.Common.CommonModel;
using System.ComponentModel.DataAnnotations;

namespace MarketPlace.Common.DTOs.RequestModels.Inventory
{
    public class CruiseInventoryRequest :RecordBase
    {

        public int? Id { get; set; }
        /// <summary>
        /// Sail Date
        /// </summary>
        [Required]
        public DateTime SailDate { get; set; }
        /// <summary>
        /// Group Id
        /// </summary>
        public required  string GroupId { get; set; }
        /// <summary>
        /// Nights
        /// </summary>
        public required string Nights { get; set; }
        /// <summary>
        /// Deck
        /// </summary>
        public required string Deck { get; set; }
        /// <summary>
        /// PackageName
        /// </summary>
        public required string Package { get; set; }

        public int DestinationId { get; set; }
        public int DeparturePortId { get; set; }
        public int CruiseLineId { get; set; }
        public int CruiseShipId { get; set; }
        public required string ShipCode { get; set; }
        public required string CategoryId { get; set; }
        public required string Stateroom { get; set; }
        public bool EnableAdmin { get; set; }
        public bool EnableAgent { get; set; }
        public List<string>? DeckImages { get; set; }

    }
}

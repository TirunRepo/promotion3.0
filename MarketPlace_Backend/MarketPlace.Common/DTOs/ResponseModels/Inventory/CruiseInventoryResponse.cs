using MarketPlace.Common.CommonModel;
using MarketPlace.Common.DTOs.RequestModels.Inventory;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.ResponseModels.Inventory
{
    public class CruiseInventoryResponse : RecordBase
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
        public required string GroupId { get; set; }
        /// <summary>
        /// Nights
        /// </summary>
        public required string Nights { get; set; }
        ///<summary>
        /// Deck
        ///</summary>
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
        public required string PricingType { get; set; }
        public int CommisionRate { get; set; }
        public int? SinglePrice { get; set; }
        public int? DoublePrice { get; set; }
        public int? TriplePrice { get; set; }
        public int Nccf { get; set; }
        public int Tax { get; set; }
        public int Grats { get; set; }
        public required string CurrencyType { get; set; }
        public List<CabinDetails> CabinDetails { get; set; }
        public bool EnableAdmin { get; set; }
        public bool EnableAgent { get; set; }
        public decimal? CommisionSingleRate { get; set; }
        public decimal? CommisionDoubleRate { get; set; }
        public decimal? CommisionTripleRate { get; set; }
        public required string CabinOccupancy { get; set; }

        public decimal? TotalPrice { get; set; }
        public int? AppliedPromotionCount { get; set; }

    }

    public class CabinDetails
    {
        public string CabinNo { get; set; }
        public string CabinType { get; set; }
        public string CabinOccupancy { get; set; }
    }

}

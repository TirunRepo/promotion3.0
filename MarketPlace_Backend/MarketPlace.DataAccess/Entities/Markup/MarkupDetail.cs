using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.DataAccess.Entities.Markup
{
    public class MarkupDetail :RecordBase
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public DateTime SailDate { get; set; }

        public required string GroupId { get; set; }
        public required string CategoryId { get; set; }

        public required string CabinOccupancy { get; set; }

        public decimal SingleRate { get; set; }
        public decimal DoubleRate { get; set; }
        public decimal TripleRate { get; set; }

        public decimal BaseFare { get; set; }
        public decimal NCCF { get; set; }
        public decimal Tax { get; set; }
        public decimal Grats { get; set; }

        public required string MarkupMode { get; set; } // Percentage, Amount

        public decimal MarkUpPercentage { get; set; }

        public decimal MarkUpFlatAmount { get; set; }

        public decimal CalculatedFare { get; set; }

        public int ShipId { get; set; }
        public int CruiseLineId { get; set; }
        public int DestinationId { get; set; }
        public bool IsActive { get; set; }



    }
}

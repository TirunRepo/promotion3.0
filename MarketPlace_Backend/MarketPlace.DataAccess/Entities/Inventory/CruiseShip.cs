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
    public class CruiseShip : RecordBase
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [StringLength(500)]
        public required string Name { get; set; }
        [Required]
        [StringLength(50)]
        public required string Code { get; set; }

        [Required]
        [ForeignKey("CruiseLineId")]
        public int CruiseLineId { get; set; } 

    }
}

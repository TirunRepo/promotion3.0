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
    public class DeparturePort :RecordBase
    {
        [Key]
        public int Id { get; set; }  // 🔹 New Primary Key

        [Required]
        [StringLength(50)]
        public required string Code { get; set; }

        [Required]
        [StringLength(255)]
        public required string Name { get; set; }

        [Required]
        [ForeignKey("DestinationId")]
        public required int DestinationId { get; set; }  //  The actual FK property
    }
}

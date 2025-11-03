using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.DataAccess.Entities.Inventory
{
    public class CruiseLine :RecordBase
    {
        [Key]
        public int Id { get; set; }  // 🔹 New Primary Key
        [Required]
        [StringLength(500)]
        public required string Name { get; set; }
        [Required]
        [StringLength(50)]
        public required string Code { get; set; } 

    }
}

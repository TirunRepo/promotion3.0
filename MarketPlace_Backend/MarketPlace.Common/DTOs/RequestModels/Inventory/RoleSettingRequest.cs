using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.RequestModels.Inventory
{
    public class InventoryRoleUpdateRequest : RecordBase
    {
        public int? Id { get; set; }

        [Required]
        public string UserRole { get; set; } = string.Empty;

        public bool EnableAdmin { get; set; } = false;
        public bool EnableAgent { get; set; } = false;
    }
}

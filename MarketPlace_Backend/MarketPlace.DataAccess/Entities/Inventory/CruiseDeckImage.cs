using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.DataAccess.Entities.Inventory
{
    [Table("CruiseDeckDetails")]
    public class CruiseDeckImage
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("CruiseInventory")]
        public int CruiseInventoryId { get; set; }

        public string Deck { get; set; } = string.Empty;

        public string DeckImage { get; set; } = string.Empty;  // URL or file path of the image

        public int CreatedBy { get; set; }

        public DateTime CreatedOn { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedOn { get; set; }

        // Navigation property (optional)
        public CruiseInventory? CruiseInventory { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.Types.Inventory
{
    public enum CabinCategoryEnum
    {
        [Display(Name = "Interior")]
        I, // Interior
        [Display(Name = "Oceanview")]
        O, // Oceanview
        [Display(Name = "Balcony")]
        B, // Balcony
        [Display(Name = "Deluxe/Suits")]
        D  // Deluxe
    }
}

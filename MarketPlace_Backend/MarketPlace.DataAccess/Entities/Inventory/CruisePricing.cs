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
    public class CruisePricing:RecordBase
    {
        [Key]
        public int Id { get; set; }
        public int CruiseInventoryId { get; set; }
        public required string PricingType { get; set; }
        public int CommisionRate {get;set;}

        [Column(TypeName = "decimal(10,2)")]
        public decimal? SinglePrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? DoublePrice { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? TriplePrice { get; set; }

        public string CurrencyType { get; set; }
        public required string CabinOccupancy { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Tax { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Grats { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Nccf { get; set; }

        public decimal CommisionSingleRate
        {
            get
            {
                if (SinglePrice == null) return 0m;
                return SinglePrice.Value + (SinglePrice.Value * CommisionRate / 100m);
            }
            set
            {
                if (CommisionRate == 0)
                {
                    SinglePrice = value;
                }
                else
                {
                    SinglePrice = value / (1 + (CommisionRate / 100m));
                }
            }
        }


        public decimal CommisionDoubleRate
        {
            get
            {
                if (DoublePrice == null) return 0m;
                return DoublePrice.Value + (DoublePrice.Value * CommisionRate / 100m);
            }
            set
            {
                if (CommisionRate == 0)
                {
                    DoublePrice = value;
                }
                else
                {
                    DoublePrice = value / (1 + (CommisionRate / 100m));
                }
            }
        }
        public decimal CommisionTripleRate
        {
            get
            {
                if (TriplePrice == null) return 0m;
                return TriplePrice.Value + (TriplePrice.Value * CommisionRate / 100m);
            }
            set
            {
                if (CommisionRate == 0)
                {
                    TriplePrice = value;
                }
                else
                {
                    TriplePrice = value / (1 + (CommisionRate / 100m));
                }
            }
        }

        public decimal CalculateTotalPrice()
        {
                decimal nccf = Nccf;
                decimal tax = Tax;
                decimal grats = Grats;

                return  CabinOccupancy?.ToLower() switch
                {
                    "single" => PricingType.Equals("Commissionable", StringComparison.OrdinalIgnoreCase)
                            ? CommisionSingleRate + nccf + tax + grats
                            : (SinglePrice ?? 0m) + nccf + tax + grats,

                    "double" => PricingType.Equals("Commissionable", StringComparison.OrdinalIgnoreCase)
                            ? CommisionDoubleRate + (nccf + tax + grats) * 2
                            : (SinglePrice ?? 0m) + (DoublePrice ?? 0m) + (nccf + tax + grats) * 2,

                    "triple" => PricingType.Equals("Commissionable", StringComparison.OrdinalIgnoreCase)
                            ? CommisionTripleRate + CommisionDoubleRate * 2 + (nccf + tax + grats) * 3
                            : (TriplePrice ?? 0m) + (DoublePrice ?? 0m) * 2 + (nccf + tax + grats) * 3,

                    "quad" => PricingType.Equals("Commissionable", StringComparison.OrdinalIgnoreCase)
                            ? CommisionTripleRate * 2 + CommisionDoubleRate * 2 + (nccf + tax + grats) * 4
                            : (TriplePrice ?? 0m) * 2 + (DoublePrice ?? 0m) * 2 + (nccf + tax + grats) * 4,

                   _ => 0m
                };
        }

        public decimal DiscountRate { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice {
            get
            {
                // always calculate before returning
                return CalculateTotalPrice();
            }
            set
            {
                decimal _totalPrices;
                // allow EF/manual override
                _totalPrices = value;
            }
        }
    }
}

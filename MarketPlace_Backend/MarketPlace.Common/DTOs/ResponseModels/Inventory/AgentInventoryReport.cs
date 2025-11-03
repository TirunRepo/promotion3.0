using MarketPlace.Common.CommonModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MarketPlace.Common.DTOs.ResponseModels.Inventory
{
    public class AgentInventoryReport : RecordBase
    {
        public int Id { get; set; }
        public DateTime SailDate { get; set; }
        public string GroupId { get; set; }
        public string CategoryId { get; set; }
        public int InventoryId { get; set; }
        public int AgentId { get; set; }
        public string AgentName { get; set; }
        public  string ShipCode { get; set; }
        public  string Stateroom { get; set; }
        public  string CabinOccupancy { get; set; }
        public int TotalCabins { get; set; }
        public int HoldCabins { get; set; }
        public int ConfirmCabins { get; set; }
        public int AvailableCabins { get; set; }
        public decimal BaseFare { get; set; }
        public string MarkupMode { get; set; }
        public decimal MarkUpPercentage { get; set; }
        public decimal MarkUpFlatAmount { get; set; }
    }
}

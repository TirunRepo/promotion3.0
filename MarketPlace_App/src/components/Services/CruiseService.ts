import type { IIdNameModel, IIdNameValueModel } from "../../common/IIdNameModel";
import type { IPagedData } from "../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";

// ----------------------------
// Models / Interfaces
// ----------------------------
export interface ICabinDetails {
  cabinNo: string;
  cabinType: string;
  cabinOccupancy: string;
  isRemoveCabin: boolean;
}

export interface IManualCabinDetails {
  id?: number;
  name: string;
  value: string;
}

export interface ICruiseInventory {
  id?: number;
  sailDate: string;
  groupId: string;
  nights: string;
  package: string;
  destinationId: number | string;
  departurePortId: number | string;
  cruiseLineId: number;
  cruiseShipId: number;
  shipCode: string;
  categoryId: string;
  stateroom: string;
  cabinOccupancy: string;
  deck: string;
  currencyType: string;
  pricingType: string;
  commisionRate: number | null;
  singlePrice: number | null;
  doublePrice: number | null;
  triplePrice: number | null;
  nccf: number | null;
  tax: number | null;
  grats: number | null;
  cabinDetails: ICabinDetails[];
  enableAdmin: boolean;
  enableAgent: boolean;
  commisionSingleRate?: number | null;
  commisionDoubleRate?: number | null;
  commisionTripleRate?: number | null;
  totalPrice?: number | null;
  deckImagesBase64?: string[];
  appliedPromotionCount?: number;
}

// Pricing model
export interface ICruisePricing {
  id?: number
  cruiseInventoryId?: number;
  pricingType: string;
  commisionRate: number | null;
  singlePrice: number | null;
  doublePrice: number | null;
  triplePrice?: number | null;
  tax: number | null;
  grats: number | null;
  nccf: number | null;
  currencyType: string;
  cabinOccupancy: string;
  totalPrice: number | null | undefined
}

// Cabin model
export interface ICruiseCabin {
  cruiseInventoryId?: number;
  id?: number;
  cabinNo: string;
  cabinType: string;
  cabinOccupancy: string;
}

export interface ICruiseInverntoryStatus {
  id: number;
  userRole: string;
  enableAdmin: boolean;
  enableAgent: boolean;
}


export interface IAgentInventoryReport {
  id: number;
  sailDate: string; // ISO Date string
  groupId: string;
  package: string;
  nights: string;
  deck: string;
  destinationId: number;
  departurePortId: number;
  cruiseLineId: number;
  cruiseShipId: number;
  shipCode: string;
  categoryId: string;
  stateroom: string;
  enableAdmin: boolean;
  enableAgent: boolean;
  totalCabins: number;
  holdCabins: number;
  availableCabins: number;
  baseFare: number;
  markupMode: string;
  markUpPercentage: number;
  markUpFlatAmount: number;
  createdBy: number;
  updatedBy: number;
  createdOn: string;
  updatedOn: string;

}

// ----------------------------
// Service
// ----------------------------
class CruiseService {
  private route = "CruiseInventories";

  // Inventory
  saveCruiseInventory = (data: ICruiseInventory) =>
    ApiUtility.post<ICruiseInventory>(`${this.route}/CruiseInventory`, data);

  updateCruiseInventory = (id: number, data: ICruiseInventory) =>
    ApiUtility.post<ICruiseInventory>(`${this.route}/CruiseInvemtory/update/${id}`, data);

  // Update Inventory Status
  updateInventory = (data: ICruiseInverntoryStatus) =>
    ApiUtility.post<IApiResponse<ICruiseInventory>>(`${this.route}/UpdateRoles`, data);

  getManualInventory = (id: number) =>
    ApiUtility.get<IApiResponse<IManualCabinDetails[]>>(`${this.route}/GetManualCabin/${id}`);


  // Pricing
  saveCruisePricing = (data: ICruisePricing) =>
    ApiUtility.post<ICruisePricing>(`${this.route}/CruisePricing`, data);

  updateCruisePricing = (id: number, data: ICruisePricing) =>
    ApiUtility.post<ICruisePricing>(`${this.route}/CruisePricing/update/${id}`, data);

  // Cabins
  saveCruiseCabins = (data: ICruiseCabin[]) =>
    ApiUtility.post<ICruiseCabin[]>(`${this.route}/CruiseCabin`, data);

  updateCruiseCabins = (id: number, data: ICruiseCabin[]) =>
    ApiUtility.post<ICruiseCabin[]>(`${this.route}/CruiseCabin/update/${id}`, data);

  // Read APIs
  getInventory = (page: number, pageSize: number) =>
    ApiUtility.get<IPagedData<ICruiseInventory>>(
      `${this.route}?page=${page}&pageSize=${pageSize}`
    );

  getDestinations = () =>
    ApiUtility.get<IApiResponse<IIdNameModel<number>[]>>(
      `${this.route}/destination`
    );

  getPorts = (id: string | number) =>
    ApiUtility.get<IApiResponse<IIdNameModel<number>[]>>(
      `${this.route}/departureaCodeByDestination/${id}`
    );

  getCruiseLines = () =>
    ApiUtility.get<IApiResponse<IIdNameModel<number>[]>>(
      `${this.route}/cruiseLine`
    );

  getShips = (id: number) =>
    ApiUtility.get<IApiResponse<IIdNameValueModel<number>[]>>(
      `${this.route}/shipByCruiseLine/${id}`
    );

  deleteInventory = (id: number) => ApiUtility.delete(`/CruiseInventories/${id}`);
  deleteCabin = (data: ICabinDetails, id: number) => ApiUtility.post<IApiResponse<void>>(`${this.route}/cabin/${id}`, data);

  // Agent Inventory  
  getAgentInventoryReport = (agentId: number, page: number, pageSize: number) =>
    ApiUtility.get<IApiResponse<IPagedData<IAgentInventoryReport>>>(
      `${this.route}/GetAgentInventoryReport?agentId=${agentId}&page=${page}&pageSize=${pageSize}`
    );

  getByCruiseInventoryId = (cruiseInventoryId: number) => {
    return ApiUtility.get<IApiResponse<ICruisePricing>>(
      `${this.route}/GetByCruiseInventoryId`,
      { cruiseInventoryId }
    );
  };
}

export default new CruiseService();


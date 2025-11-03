import type { IIdNameModel } from "../../../common/IIdNameModel";
import type { IPagedData } from "../../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface IMarkupRequest {
  id?: number;
  inventoryId: number;
  agentName: string;
  sailDate: string;
  groupId: string;
  categoryId: string;
  cabinOccupancy: string;
  singleRate: number;
  doubleRate: number;
  tripleRate: number;
  baseFare: number;
  nccf: number;
  tax: number;
  grats: number;
  markupMode: string;
  markUpPercentage: number;
  markUpFlatAmount: number;
  calculatedFare: number;
  isActive: boolean;
  shipName?: string;
  cruiseLine?: string;
  destination?: string;
  promotionName?: string;
}
export interface IShipDetails{
   ship:IIdNameModel<number>;
   cruiseLine:IIdNameModel<number>;
   destination:IIdNameModel<number>;
}

class MarkupService {
  private route = "Markup";

  getSailDates = async (): Promise<{ id: number; name: string; value: string }[]> => {
    const response = await ApiUtility.get<{ id: number; name: string; value: string }[]>(
      `${this.route}/sailDates`
    );
    return response.data;
  };

  getGroupId = async (sailDate: string): Promise<{ id: number; name: string }[]> => {
    const response = await ApiUtility.get<{ id: number; name: string }[]>(
      `${this.route}/groupId`
      , { sailDate });
    return response.data;
  };

  getCategoryIds = async (sailDate: string, groupId: string): Promise<{ id: number; name: string }[]> => {
    const response = await ApiUtility.get<{ id: number; name: string }[]>(
      `${this.route}/CategoryId`, { sailDate, groupId }
    );
    return response.data;
  };

  getOccupanciesWithRates = async (
    id?:number
  ): Promise<{
    cabinOccupancy: string;
    singleRate: number;
    doubleRate: number;
    tripleRate: number;
    nccf: number;
    tax: number;
    grats: number;
    shipName?: string;
    cruiseLine?: string;
    destination?: string;
    promotionName?: string;
  }> => {
    const response = await ApiUtility.get<
      {
        cabinOccupancy: string;
        singleRate: number;
        doubleRate: number;
        tripleRate: number;
        nccf: number;
        tax: number;
        grats: number;
        shipName?: string;
        cruiseLine?: string;
        destination?: string;
        promotionName?: string;
      }
    >(`${this.route}/CabinOccupancy`,{id});
    return response.data;
  };

  create = (data: IMarkupRequest) =>
    ApiUtility.post<IApiResponse<IMarkupRequest>>(`${this.route}`, data);

  update = (id: number, data: IMarkupRequest) =>
    ApiUtility.put<IApiResponse<IMarkupRequest>>(`${this.route}/${id}`, data);

  delete = (id: number) =>
    ApiUtility.delete<IApiResponse<boolean>>(`${this.route}/${id}`);

  getAll = (page: number, pageSize: number) =>
    ApiUtility.get<IApiResponse<IPagedData<IMarkupRequest>>>(
      `${this.route}?page=${page}&pageSize=${pageSize}`
    );
  getShipDetails = (id:number) => ApiUtility.get<IShipDetails>(`${this.route}/shipDetails`,{id})
}

export default new MarkupService();

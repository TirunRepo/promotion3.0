// ShipService.ts
import type { IPagedData } from "../../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface CruiseLineD {
  id?: number;
  name: string;
}

export interface Ship {
  id?: number;
  code: string;
  name: string;
  cruiseLineId?: number;
}



class CruiseShipsService {
  private route = "CruiseShips";

  getShips = (page: number, pageSize: number) =>
    ApiUtility.get<IApiResponse<IPagedData<Ship>>>(`${this.route}?page=${page}&pageSize=${pageSize}`);

  addShip = (data: Ship) =>
    ApiUtility.post<IApiResponse<Ship>>(this.route, data);

  updateShip = (id:number,data: Ship) =>
    ApiUtility.post<IApiResponse<Ship>>(`${this.route}/update/${id}`, data);

  deleteShip = (id: number) =>
    ApiUtility.delete<IApiResponse<boolean>>(`${this.route}/${id}`);

  getCruiseLines = () => ApiUtility.get<CruiseLineD>(`${this.route}/CruiseLines`,{})

}

export default new CruiseShipsService();

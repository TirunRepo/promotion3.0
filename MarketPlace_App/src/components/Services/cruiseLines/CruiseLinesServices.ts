// CruiseLineService.ts
import type { IPagedData } from "../../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface CruiseLine {
  id?: number | null;
  code: string;
  name: string;
}

class CruiseLineService {
  private route = "CruiseLines";

  getCruiseLines = (page: number, pageSize: number) =>
    ApiUtility.get<IApiResponse<IPagedData<CruiseLine>>>(`${this.route}?page=${page}&pageSize=${pageSize}`);

  addCruiseLine = (data: CruiseLine) =>
    ApiUtility.post<IApiResponse<CruiseLine>>(this.route, data);

  updateCruiseLine = (id:number,data: CruiseLine) =>
    ApiUtility.post<IApiResponse<CruiseLine>>(`${this.route}/update/${id}`, data);

  deleteCruiseLine = (id: number) =>
    ApiUtility.post<IApiResponse<boolean>>(`${this.route}/${id}`);
}

export default new CruiseLineService();

import type { IPagedData } from "../../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface Destination {
    id?:number
    code: string;
    name: string;
}

class CruiseDestinationService {
    private route = "CruiseDestinations";

    getAll = (page: number, pageSize: number) => 
        ApiUtility.get<IApiResponse<IPagedData<Destination>>>(`${this.route}?page=${page}&pageSize=${pageSize}`);
    add = (data: Destination) => ApiUtility.post<IApiResponse<Destination>>(this.route, data);
    update = (id:number,data: Destination) => ApiUtility.post<IApiResponse<Destination>>(`${this.route}/update/${id}`, data);
    delete = (code: number) => ApiUtility.post<IApiResponse<boolean>>(`${this.route}/${code}`);
}

export default new CruiseDestinationService();

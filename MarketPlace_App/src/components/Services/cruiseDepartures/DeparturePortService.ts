import type { IPagedData } from "../../../common/IPagedData";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

export interface DeparturePort {
    id?: number | null;
    code: string;
    name: string;
    destinationId?: number
}

export interface DestinationDTO {
    id?: number | null;
    name: string;
}

class DeparturePortService {
    private route = "CruiseDeparturePorts";

    // Get all departure ports (optionally with paging)
    getAll = (page?: number, pageSize?: number) =>
        ApiUtility.get<IApiResponse<IPagedData<DeparturePort>>>(
            page && pageSize ? `${this.route}?page=${page}&pageSize=${pageSize}` : this.route
        );


    // Add a new departure port
    add = (data: DeparturePort) =>
        ApiUtility.post<IApiResponse<DeparturePort>>(this.route, data);

    // Update an existing departure port
    update = (id: number, data: DeparturePort) =>
        ApiUtility.post<IApiResponse<DeparturePort>>(`${this.route}/update/${id}`, data);

    // Delete a departure port
    delete = (id: number) =>
        ApiUtility.delete<IApiResponse<boolean>>(`${this.route}/${id}`);

    // Get all destinations
    getAllDestinations = () =>
        ApiUtility.get<DestinationDTO[]>(`${this.route}/destination`);
}

export default new DeparturePortService();

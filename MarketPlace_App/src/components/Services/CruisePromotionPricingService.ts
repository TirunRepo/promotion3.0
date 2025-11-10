import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";

export interface ICruisePromotionPricing {
    id: number;
    promotionId: number;
    cruiseInventoryId?: number;
    pricingType: string;
    commisionRate: number | null;
    basePrice: number | null;
    currencyType: string;
    cabinOccupancy: string;
    tax: number | null;
    grats: number | null;
    nccf: number | null;
    commisionSingleRate: number | null;
    commisionDoubleRate: number | null;
    commisionTripleRate: number | null;
    totalPrice: number | null;

}

class CruisePromotionPricingService {

    private _route = "CruisePromotionPricing";

    getById = (Id: number) =>
        ApiUtility.getResult<ICruisePromotionPricing[]>(`${this._route}/GetById`, Id);

    getByCruiseInventory = (CruiseInventoryId: number) =>
        ApiUtility.getResult<ICruisePromotionPricing[]>(
            `${this._route}/GetByCruiseInventory`,
            { CruiseInventoryId }
        );

    insert = (data: ICruisePromotionPricing) =>
        ApiUtility.post<IApiResponse<ICruisePromotionPricing>>(`${this._route}/Insert`, data);

    update = (data: ICruisePromotionPricing) =>
        ApiUtility.put<IApiResponse<ICruisePromotionPricing>>(`${this._route}/Update`, data);

    delete = (Id: number) => ApiUtility.delete(`${this._route}/Delete/${Id}`);



}

export default new CruisePromotionPricingService();
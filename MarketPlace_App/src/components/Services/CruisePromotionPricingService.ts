import ApiUtility, { type IApiResponse } from "../../utility/ApiUtility";

export interface ICruisePromotionPricing {
    id: number;
    promotionId: number;
    cruiseInventoryId?: number;
    pricingType: string;
    commisionRate: number | null;
    singlePrice: number | null;
    doublePrice: number | null;
    triplePrice?: number | null;
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


}

export default new CruisePromotionPricingService();
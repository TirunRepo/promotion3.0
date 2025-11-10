import type { IIdNameModel, IIdNameValueModel } from "../../../common/IIdNameModel";
import ApiUtility, { type IApiResponse } from "../../../utility/ApiUtility";

// Request & Response DTOs
export interface IPromotionRequest {
  promotionTypeId: number;
  promotionName: string;
  promotionDescription: string;
  discountPer?: number;
  discountAmount?: number | null;
  promoCode: string;
  loyaltyLevel?: string;
  isFirstTimeCustomer: boolean;
  minNoOfAdultRequired?: number;
  minNoOfChildRequired?: number;
  isAdultTicketDiscount: boolean;
  isChildTicketDiscount: boolean;
  minPassengerAge?: number;
  maxPassengerAge?: number;
  passengerType?: string;
  cabinCountRequired?: number;
  sailingId?: number;
  supplierId?: number;
  affiliateName?: string;
  includesAirfare: boolean;
  includesHotel: boolean;
  includesWiFi: boolean;
  includesShoreExcursion: boolean;
  onboardCreditAmount?: number;
  freeNthPassenger?: number;
  startDate: string;
  endDate: string;
  isStackable: boolean;
  isActive: boolean;
  sailDate?: any;
  destinationId?: any;
  cruiseLineId?: any
  groupId?: any;
  calculatedOn: string;
  discountType?: string;
  isBOGO: boolean;
}

export interface IPromotionResponse extends IPromotionRequest {
  id: number | null;
}

class PromotionService {
  private route = "Promotion";

  createPromotion = (data: IPromotionRequest) =>
    ApiUtility.post<IApiResponse<IPromotionResponse>>(`${this.route}`, data);

  updatePromotion = (data: IPromotionRequest) =>
    ApiUtility.put<IApiResponse<IPromotionResponse>>(`${this.route}`, data);

  getPromotion = (id: number) =>
    ApiUtility.get<IApiResponse<IPromotionResponse>>(`${this.route}/${id}`);

  getAllPromotions = () =>
    ApiUtility.get<IApiResponse<IPromotionResponse[]>>(`${this.route}`);

  deletePromotion = (id: number) =>
    ApiUtility.delete<IApiResponse<string>>(`${this.route}/${id}`);

  calculatePromotion = (data: any) =>
    ApiUtility.post<IApiResponse<number>>(
      `${this.route}/calculate-discount`,
      data
    );

  /** 🔹 Get all Sail Dates */
  getAllSailDates = () =>
    ApiUtility.get<IIdNameValueModel<number>[]>(
      `${this.route}/sailDates`
    );

  /** 🔹 Get Destinations by Sail Date */
  getDestinationBySailDate = (sailDate: string) =>
    ApiUtility.get<IIdNameModel<number>[]>(
      `${this.route}/DestinationBySailDate?sailDate=${sailDate}`
    );

  /** 🔹 Get CruiseLines by Sail Date */
  getCruiseLineBySailDate = (sailDate: string) =>
    ApiUtility.get<IIdNameModel<number>[]>(
      `${this.route}/CruiseLineBySailDate?sailDate=${sailDate}`
    );
  getGroupIdBySailDate = (sailDate: string) =>
    ApiUtility.get<IIdNameModel<number>[]>(
      `${this.route}/GroupIdBySailDate?sailDate=${sailDate}`
    );

  getPromotionType = () => ApiUtility.get<IIdNameModel<number>[]>(`${this.route}/PromotionType`)
}

export default new PromotionService();

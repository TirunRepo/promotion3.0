import type { ICruisePricing } from "../components/Services/CruiseService";
import type { IPromotionResponse } from "../components/Services/Promotions/PromotionService";
import type { ICruisePromotionPricing } from "../components/Services/CruisePromotionPricingService";

export const PromotionUtility = {
    calculatePricing: (
        promotion: IPromotionResponse,
        cruisePricing: ICruisePricing
    ): Partial<ICruisePromotionPricing> => {
        // Example logic — replace with your actual formula

        let price: ICruisePromotionPricing = {
            id: 0,
            promotionId: promotion.id ?? 0,
            pricingType: cruisePricing.pricingType,
            commisionRate: cruisePricing.commisionRate,
            basePrice: PromotionUtility.calculateBasePrice(cruisePricing),
            currencyType: cruisePricing.currencyType,
            cabinOccupancy: cruisePricing.cabinOccupancy,
            tax: cruisePricing.tax,
            grats: cruisePricing.grats,
            nccf: cruisePricing.nccf,
            commisionSingleRate: 0,
            commisionDoubleRate: 0,
            commisionTripleRate: 0,
            totalPrice: cruisePricing.totalPrice ?? 0
        }

        switch (promotion.calculatedOn.toLowerCase().replace(/\s+/g, "")) {
            case "basefare":
                price.basePrice = PromotionUtility.calculateBasePriceAfterPromotion(promotion, cruisePricing);
                break
        }

        price.totalPrice = PromotionUtility.calculateTotalPriceAfterPromotion(price);

        return price;
    },
    calculateBasePrice: (
        cruisePricing: ICruisePricing
    ): number => {

        let basePrice = cruisePricing.doublePrice ?? 0
        switch (cruisePricing.cabinOccupancy.toLowerCase()) {
            case "single":
                return basePrice;
            case "double":
                return (basePrice * 2);
            case "triple":
                return (basePrice * 2) + (cruisePricing.triplePrice ?? 0);
            case "quad":
                return (basePrice * 2) + ((cruisePricing.triplePrice ?? 0) * 2);
        }

        return basePrice;
    },
    calculateBasePriceAfterPromotion: (
        promotion: IPromotionResponse,
        cruisePricing: ICruisePricing
    ): number => {
        let price = PromotionUtility.calculateBasePrice(cruisePricing);

        switch (promotion?.discountType?.toLocaleLowerCase().replace(/\s+/g, "")) {
            case ("flat"):
                price = price - (promotion.discountAmount ?? 0);
                break;
            case ("percent"):
                price = price - ((price * (promotion.discountPer ?? 0)) / 100);
                break;
        }

        return price;
    },
    calculateTotalPriceAfterPromotion: (
        pricing: ICruisePromotionPricing
    ): number => {
        let price = (pricing.basePrice ?? 0) + (pricing.nccf ?? 0) + (pricing.tax ?? 0) + (pricing.grats ?? 0)

        return price;
    }
};

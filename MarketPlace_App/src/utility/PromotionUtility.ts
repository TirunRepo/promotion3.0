import type { ICruisePricing } from "../components/Services/CruiseService";
import type { IPromotionResponse } from "../components/Services/Promotions/PromotionService";
import type { ICruisePromotionPricing } from "../components/Services/CruisePromotionPricingService";

export const PromotionUtility = {
    calculatePricing: (
        promotion: IPromotionResponse,
        cruisePricing: ICruisePricing
    ): Partial<ICruisePromotionPricing> => {

        let price: ICruisePromotionPricing = {
            id: 0,
            promotionId: promotion.id ?? 0,
            pricingType: cruisePricing.pricingType,
            commisionRate: cruisePricing.commisionRate,
            basePrice: PromotionUtility.calculateBasePriceWithoutPromo(cruisePricing),
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

        if (promotion.discountType?.toLowerCase().replace(/\s+/g, "") == "flat" && price.totalPrice) {
            price.totalPrice = price.totalPrice - (promotion.discountAmount ?? 0);
            return price;
        }

        if (promotion.isBOGO && price.basePrice && price.totalPrice) {
            let discountPrice = 0;
            let count = 1;
            switch (cruisePricing.cabinOccupancy.toLowerCase()) {
                case "double":
                    discountPrice = ((cruisePricing.doublePrice ?? 0) * (promotion.discountPer ?? 0)) / 100;
                    break
                case "triple":
                    discountPrice = ((cruisePricing.doublePrice ?? 0) * (promotion.discountPer ?? 0)) / 100;
                    discountPrice = discountPrice + (((cruisePricing.triplePrice ?? 0) * (promotion.discountPer ?? 0)) / 100);
                    break
                case "quad":
                    count = 2;
                    discountPrice = ((cruisePricing.doublePrice ?? 0) * (promotion.discountPer ?? 0)) / 100;
                    discountPrice = discountPrice + (((cruisePricing.triplePrice ?? 0) * (promotion.discountPer ?? 0)) / 100);
                    break
            }
            if (promotion.calculatedOn.toLowerCase().replace(/\s+/g, "") == "basefare+nccf") {
                discountPrice = discountPrice + (count * PromotionUtility.calculateNCCFAfterPromotion(promotion, cruisePricing));
            }
            price.totalPrice = price.totalPrice - discountPrice;
            return price;
        }

        if (promotion.discountType?.toLowerCase().replace(/\s+/g, "") == "percentage" && price.totalPrice) {

            price.basePrice = PromotionUtility.calculateBasePrice(promotion, cruisePricing)

            if (promotion.calculatedOn.toLowerCase().replace(/\s+/g, "") == "basefare+nccf") {
                price.nccf = PromotionUtility.calculateNCCFAfterPromotion(promotion, cruisePricing);
            }
            price.totalPrice = PromotionUtility.calculateTotalPriceAfterPromotion(price);
            return price;

        }

        return price;
    },
    calculateBasePriceWithoutPromo: (
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
    calculateBasePrice: (
        promotion: IPromotionResponse,
        cruisePricing: ICruisePricing
    ): number => {
        let price = PromotionUtility.calculateBasePriceWithoutPromo(cruisePricing);
        return price - ((price * (promotion.discountPer ?? 0)) / 100);

    },
    calculateNCCFAfterPromotion: (
        promotion: IPromotionResponse,
        cruisePricing: ICruisePricing
    ): number => {
        let price = cruisePricing.nccf ?? 0;
        return price - ((price * (promotion.discountPer ?? 0)) / 100);

    },
    calculateTotalPriceAfterPromotion: (
        pricing: ICruisePromotionPricing
    ): number => {

        let count = 1;

        switch (pricing.cabinOccupancy.toLowerCase()) {
            case "double":
                count = 2;
                break
            case "triple":
                count = 3;
                break
            case "quad":
                count = 4;
                break
        }

        let price = (pricing.basePrice ?? 0) + (count * (pricing.nccf ?? 0)) + (count * (pricing.tax ?? 0)) + (count * (pricing.grats ?? 0))

        return price;
    },
};

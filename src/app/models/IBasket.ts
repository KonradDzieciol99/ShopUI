import { IBasketItem } from "./IBasketItem";

export interface IBasket {
    id?: number;
    basketItems: IBasketItem[];
    clientSecret?: string;
    paymentIntentId?: string;
    deliveryMethodId?: number;
    shippingPrice?: number;
}
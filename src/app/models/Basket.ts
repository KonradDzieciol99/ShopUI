import { IBasket } from "./IBasket";
import { IBasketItem } from "./IBasketItem";

export class Basket implements IBasket {
    id!: number;
    clientSecret?: string | undefined;
    paymentIntentId?: string | undefined;
    deliveryMethodId?: number | undefined;
    shippingPrice?: number | undefined;
    basketItems: IBasketItem[] = [];
}
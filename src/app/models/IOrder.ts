import { IAddress } from "./IAddress";
import { IOrderItem } from "./IOrderItem";

export interface IOrder {
    id: number;
    buyerEmail: string;
    orderDate: string;
    shipToAddress: IAddress;
    deliveryMethod: string;
    shippingPrice: number;
    orderItems: IOrderItem[];
    subtotal: number;
    status: string;
    total: number;
  }
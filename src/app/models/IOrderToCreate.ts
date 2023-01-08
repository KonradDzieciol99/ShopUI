import { IAddress } from "./IAddress";

export interface IOrderToCreate {
    basketId: number;
    deliveryMethodId: number;
    shipToAddress: IAddress;
}
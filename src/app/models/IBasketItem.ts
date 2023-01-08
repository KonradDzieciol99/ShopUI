import { IBrandOfProduct } from "./IBrandOfProduct";
import { ICategoryOfProduct } from "./ICategoryOfProduct";

export interface IBasketItem {
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    customerBasketId?:number;
    categoryOfProduct:ICategoryOfProduct;
    brandOfProduct:IBrandOfProduct;

    
}


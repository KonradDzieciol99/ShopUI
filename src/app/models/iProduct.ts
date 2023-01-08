import { IBrandOfProduct } from "./IBrandOfProduct";
import { ICategoryOfProduct } from "./ICategoryOfProduct";
import { Photo } from "./photo";

export interface IProduct {
    pictureUrl: string;
    id: number;
    productName: string;
    price:number;
    description?:string;
    quantity:number;
    photos: Photo[];
    categoryOfProduct:ICategoryOfProduct
    brandOfProduct:IBrandOfProduct,
    cutPrice?:number;
  }
  
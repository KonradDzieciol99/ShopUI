export interface ICreateProduct {
    productName: string;
    price:number;
    description:string;
    quantity:number;
    files: File[];
    mainPhotoIndex:number;
}
  
import { IBrandOfProduct } from "./IBrandOfProduct";
import { ICategoryOfProduct } from "./ICategoryOfProduct";

export class IQueryParametersAggregate {

    constructor(search:string|undefined,
        priceFrom:string|null|undefined,
        priceTo:string|null|undefined,
        categories:string[]|string|undefined,
        brands:string[]|undefined,
        orderByfield:string|undefined,
        orderAscending:string|undefined) { 
    this.search=search;
    this.priceFrom=priceFrom;
    this.priceTo=priceTo;
    if(Array.isArray(categories)) {
        this.categories=categories
    } else if(categories){
        this.categories = [categories];
    }else{
        this.categories = undefined;
    }
    if(Array.isArray(brands)) {
        this.brands=brands
    } else if(brands){
        this.brands = [brands];
    }else{
        this.brands = undefined;
    }
    this.orderByfield=orderByfield;
    this.orderAscending=orderAscending;
    }
    search:string|undefined;
    priceFrom:string|null|undefined;
    priceTo:string|null|undefined;
    categories:string[]|undefined;
    brands:string[]|undefined;
    orderByfield:string|undefined;
    orderAscending:string|undefined;
}

// export class IQueryParametersAggregate {
//     search:string|undefined;
//     priceFrom:string|null|undefined;
//     priceTo:string|null|undefined;
//     private _categories:string[]|undefined;
//     brands:string[]|undefined;
//     orderByfield:string|undefined;
//     orderAscending:string|undefined;

//     // public set categories(theAge: string|string[]) {
//     //     if(Array.isArray(theAge)) {
//     //         this._categories=theAge
//     //     } else {
//     //         this._categories = [theAge];
//     //     } 
//     // }
//     public set categories(s:string|string[]|undefined){
//         if(Array.isArray(s)) {
//             this._categories=s
//         } else if(s){
//             this._categories = [s];
//         }else{
//             this._categories = undefined;
//         }
//     }
//     public get categories(){

//         return this._categories;
//     }
// }
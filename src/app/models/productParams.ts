import { IBrandOfProduct } from './IBrandOfProduct';
import { ICategoryOfProduct } from './ICategoryOfProduct';
import { User } from './user';

export class ProductParams {

    minPrice: number|undefined|null;
    maxPrice:number|undefined|null;
    pageNumber:number|undefined;
    pageSize:number|undefined;
    orderByfield:string|undefined;
    orderAscending:boolean|undefined;
    categories:ICategoryOfProduct[]|undefined;
    brands:IBrandOfProduct[]|undefined;
    search: string|undefined;
}

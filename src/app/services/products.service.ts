import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PagedList, Pagination } from '../models/pagination';
import { IProduct } from '../models/IProduct';
import { ProductParams } from '../models/productParams';
import { IBrandOfProduct } from '../models/IBrandOfProduct';
import { ICategoryOfProduct } from '../models/ICategoryOfProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private currentPaginationSource = new BehaviorSubject(new Pagination());
  currentPagination$ = this.currentPaginationSource.asObservable();
  private baseUrl = environment.apiUrl;
  private persistParams:ProductParams = new ProductParams();

  constructor(private http: HttpClient) {}
  get(){
    let httpParams = new HttpParams();
    let brandIndexs:number[]=[]
    let categoriesIndexs:number[]=[]
    if (this.persistParams.pageNumber) {
    httpParams = httpParams.append('pageNumber', this.persistParams.pageNumber);
    }
    if(this.persistParams.pageSize){
    httpParams = httpParams.append('pageSize', this.persistParams.pageSize);
    }
    if (this.persistParams.brands) {
      for (let brand of this.persistParams.brands)
      {brandIndexs.push(brand.id);}
      httpParams = httpParams.append('brands', JSON.stringify(brandIndexs))
    }
    if (this.persistParams.categories) {
      for (let category of this.persistParams.categories)
      {categoriesIndexs.push(category.id);}
      httpParams = httpParams.append('categories', JSON.stringify(categoriesIndexs))
    }

    if (this.persistParams.search) {
      httpParams = httpParams.append('search', this.persistParams.search)
    }
    if (this.persistParams.maxPrice) {
      httpParams = httpParams.append('MaxPrice', this.persistParams.maxPrice);
    }
    if (this.persistParams.minPrice) {
      httpParams = httpParams.append('MinPrice', this.persistParams.minPrice);
    }
    if (this.persistParams.orderByfield) {
    httpParams = httpParams.append('OrderByfield', this.persistParams.orderByfield);
    }
    if (this.persistParams.orderAscending !== undefined) {
    httpParams = httpParams.append('OrderAscending', this.persistParams.orderAscending);
    }
    return this.http.get<PagedList<IProduct>>(this.baseUrl+'Products/Paged',{ params: httpParams}).pipe(
      map(response=>{
        let pagination:Pagination =new Pagination()
        pagination.currentPage=response.currentPage;
        pagination.pageSize=response.pageSize;
        pagination.totalCount=response.totalCount;
        pagination.totalPages=response.totalPages;
        this.currentPaginationSource.next(pagination);
        return response;
      })
    );
  }
  getParams(){
    return this.persistParams;
  }
  setShopParams(params: ProductParams) {
    this.persistParams = params;
  }
  getBrand(){
    return this.http.get<IBrandOfProduct[]>(this.baseUrl + 'Brands?brandName');
  }
  getCatrories(){
    return this.http.get<ICategoryOfProduct[]>(this.baseUrl + 'Categories?categoryName');
  }
  getOnSale(){
    return this.http.get<PagedList<IProduct>>(this.baseUrl + 'Products/Discounted/Paged');
  }
  getById(id:number){
    return this.http.get<IProduct>(this.baseUrl + 'Products/'+id);
  }
}

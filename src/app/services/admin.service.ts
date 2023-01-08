import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IBrandOfProduct } from '../models/IBrandOfProduct';
import { ICreateProduct } from '../models/ICreateProduct';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient ) {}

  addProduct(formData:FormData){
    return this.http.post<any>(this.baseUrl + 'Products', formData);
  }
  addBrand(BrandOfProductName:string){
    return this.http.post<any>(this.baseUrl + 'Brands?brandName='+BrandOfProductName,{});
  }
  addCategory(categoryName:string){
    return this.http.post<any>(this.baseUrl + 'Categories?categoryName='+categoryName,{});
  }
}

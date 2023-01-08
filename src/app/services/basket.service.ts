import { JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, map, of, Subscription, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket } from '../models/Basket';
import { IBasket } from '../models/IBasket';
import { IBasketItem } from '../models/IBasketItem';
import { IBasketTotals } from '../models/IBasketTotals';
import { IDeliveryMethod } from '../models/IDeliveryMethod';
import { IProduct } from '../models/IProduct';
import { AccountService } from './account.service';
import { GeneralStateService } from './general-state.service';


@Injectable({
  providedIn: 'root'
})
export class BasketService implements OnDestroy {
  baseUrl = environment.apiUrl;
  private isAuthenticated:Boolean=false;
  private basketSource = new BehaviorSubject<IBasket|undefined>(undefined);
  basket$ = this.basketSource.asObservable();
  private basketTotaPriceSource = new BehaviorSubject<IBasketTotals|undefined>(undefined);
  basketTotal$ = this.basketTotaPriceSource.asObservable();
  shipping = 0;
  authSub: Subscription|undefined;

  constructor(private http: HttpClient,private accountService:AccountService ) {
    this.authSub= this.accountService.currentUser$.subscribe(user=>{
      var localbasket=this.getLocalBasketCUSTOM();
      if(user){
        this.isAuthenticated=true;
        if (localbasket) {this.afterLogginDifferenceResolver(localbasket);}
        else{this.getBasket();}
      }
      else{
        this.isAuthenticated=false;
        if (localbasket) {this.setBasket(localbasket);}
      }

    })
    this.basket$.subscribe(x=>console.log(x));
   }



   
   afterLogginDifferenceResolver(basket:IBasket){
    return this.http.put<IBasket>(this.baseUrl + 'basket/difference-resolver', basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateAll();
    });
   }

  setBasket(basket: IBasket) {
    if (this.isAuthenticated) {
      return this.http.post<IBasket>(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
        this.basketSource.next(response);
        this.calculateAll();
      });
    }else{
       return this.setLocalBasket(basket)
    }
    
  }
  setLocalBasket(basket: IBasket){
    localStorage.setItem('basket', JSON.stringify(basket));
    this.basketSource.next(basket);
    this.calculateAll();
  }
  getBasket() {
    if (this.isAuthenticated) {
      this.http.get<IBasket>(this.baseUrl + 'basket/')
      .subscribe(
        (basket: IBasket)=>{
          this.basketSource.next(basket);
          this.shipping = basket.shippingPrice ?? 0;
          this.calculateAll();
        },
        error=>{
        console.warn(error);
      });
    }else{
      this.getLocalBasket();
    }
  }
  getLocalBasketCUSTOM(): IBasket | null{
    var basket:IBasket|undefined; 
    var jsonBasket = localStorage.getItem('basket');
    if(jsonBasket){basket = JSON.parse(jsonBasket);}
    if(basket){return basket}
    return null;
  }
  getLocalBasket(){
    var basket:IBasket|undefined; 
    var jsonBasket = localStorage.getItem('basket');
    if(jsonBasket){basket = JSON.parse(jsonBasket);}
    if(basket){this.validateLocalBasket(basket)}
    if(!basket){
      this.basketSource.next(this.createBasket());
    }

  }
  validateLocalBasket(basket:IBasket){
    this.http.post<IBasket>(this.baseUrl + 'basket/ValidateBasket',basket).subscribe(response=>{
      this.basketSource.next(response);
      this.calculateAll();
    })
  }

  getCurrentBasketValue():IBasket|undefined {
    if (this.basketSource.value) {
      let BasketWithoutReference:IBasket = JSON.parse(JSON.stringify(this.basketSource.value));
      return BasketWithoutReference;
    } 
    return undefined

  }
  private calculateAll() {
    const basket = this.getCurrentBasketValue();
    if (!basket || !basket.basketItems) {return;}
    const shipping = this.shipping;
    const subtotal = basket.basketItems.reduce((a:number, b:IBasketItem) => ( b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotaPriceSource.next({shipping, total, subtotal});
  }
  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();//jeśli po lewej null ma się stać prawa strona
    basket.basketItems = this.addOrUpdateItem(basket.basketItems, itemToAdd, quantity);
    this.setBasket(basket);
  }
  private addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(i => i.productId === itemToAdd.productId);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }
  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket', JSON.stringify(basket));
    return basket;
  }
  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    let IBasketItem:IBasketItem={
      productId: item.id,
      productName: item.productName,
      price: item.price,
      quantity: quantity,
      pictureUrl: item.photos[0].url,
      categoryOfProduct: item.categoryOfProduct,
      brandOfProduct: item.brandOfProduct
    };
    return IBasketItem;
  }

  ngOnDestroy(): void {
  }
  incrementItemInBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (!basket) {return}
    const foundItemIndex = basket.basketItems.findIndex(x => x.productId === item.productId);
    basket.basketItems[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemInBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (!basket) {return}
    const foundItemIndex = basket.basketItems.findIndex(x => x.productId === item.productId);
    if (basket.basketItems[foundItemIndex].quantity > 1) {
      basket.basketItems[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (!basket) {return}
    if (basket.basketItems.some(x => x.productId === item.productId)) {
      basket.basketItems = basket.basketItems.filter(i => i.productId !== item.productId);
      if (basket.basketItems.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket); 
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket').subscribe(() => {
      this.removeLocalBasket();
    }, error => {
      console.log(error);
    })
  }
  removeLocalBasket(){
    localStorage.removeItem('basket');
    this.basketSource.next(undefined);
    this.basketTotaPriceSource.next(undefined);
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.shipping = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    if (!basket) { throw new Error('koszyk jest pusty');  }
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.calculateAll();
    this.setBasket(basket);
  }
  createtIntent() {
    if (this.getCurrentBasketValue()?.id) {
      return this.http.post<IBasket>(this.baseUrl + 'payments/' + this.getCurrentBasketValue()!.id, {})
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          console.log(this.getCurrentBasketValue());
        })
      )
    }
    throw new Error('id koszyka nie istnieje');  

  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/services/basket.service';
import { IBasketItem } from 'src/app/models/IBasketItem';
import { IBasketTotals } from 'src/app/models/IBasketTotals';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  
  public basketTotal$: Observable<IBasketTotals | undefined> 
  constructor(public basketService:BasketService) {
    this.basketTotal$=this.basketService.basketTotal$
   }
  
  ngOnInit(): void {
    
  }
  removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }

  incrementItemInBasket(item: IBasketItem) {
    this.basketService.incrementItemInBasket(item);
  }

  decrementItemInBasket(item: IBasketItem) {
    this.basketService.decrementItemInBasket(item);
  }

}

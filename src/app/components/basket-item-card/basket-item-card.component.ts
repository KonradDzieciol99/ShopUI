import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasketItem } from 'src/app/models/IBasketItem';

@Component({
  selector: 'app-basket-item-card',
  templateUrl: './basket-item-card.component.html',
  styleUrls: ['./basket-item-card.component.css']
})
export class BasketItemCardComponent implements OnInit {

  

  @Input()  basketItem!: IBasketItem;
  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();

  constructor() { }

  ngOnInit(): void {
  }
  decrementItemInBasket(item: IBasketItem) {
    this.decrement.emit(item);
  }

  incrementItemInBasket(item: IBasketItem) {
    this.increment.emit(item);
  }

  removeBasketItem(item: IBasketItem) {
    this.remove.emit(item);
  }
}

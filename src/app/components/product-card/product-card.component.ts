import { Component, Input, OnInit } from '@angular/core';
import { IBasketItem } from 'src/app/models/IBasketItem';
import { IProduct } from 'src/app/models/IProduct';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {

  @Input() product:IProduct | undefined;
  constructor() { }

  ngOnInit(): void {
  }

}

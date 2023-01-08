import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.css']
})
export class BasketSummaryComponent implements OnInit {

  @Input() shippingPrice: number|undefined=0;
  @Input() subtotal: number|undefined=0;
  @Input() total: number|undefined=0;
  constructor() { }

  ngOnInit(): void {
  }

}

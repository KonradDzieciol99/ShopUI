import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OrdersService } from 'src/app/services/orders.service';
import { IOrder } from 'src/app/models/IOrder';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
	filter = new FormControl('', { nonNullable: true });

  orders: IOrder[]|undefined;

  constructor(private orderService: OrdersService) { }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrdersForUser().subscribe((orders: IOrder[]) => {
      this.orders = orders;
    }, error => {
      console.log(error);
    })
  }

}

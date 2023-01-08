import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from 'src/app/services/orders.service';
import { IOrder } from 'src/app/models/IOrder';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  order: IOrder|undefined;

  constructor(private route: ActivatedRoute, 
    private orderService: OrdersService) {

      // private breadcrumbService: BreadcrumbService, 
      // this.breadcrumbService.set('@OrderDetailed', ' ');
     }

  ngOnInit(): void {
    this.orderService.getOrderDetailed(+this.route.snapshot.paramMap.get('id')!)
      .subscribe((order: IOrder) => {
        this.order = order;
        // this.breadcrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
      }, error => {
        console.log(error);
      })
  }
}

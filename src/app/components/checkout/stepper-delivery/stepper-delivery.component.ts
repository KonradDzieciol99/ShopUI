import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasketService } from 'src/app/services/basket.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { IDeliveryMethod } from 'src/app/models/IDeliveryMethod';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-stepper-delivery',
  templateUrl: './stepper-delivery.component.html',
  styleUrls: ['./stepper-delivery.component.css']
})
export class StepperDeliveryComponent implements OnInit {

  @Input() appStepper!: CdkStepper;
  @Input() deliveryForm!: FormGroup ;
  deliveryMethods!: IDeliveryMethod[];

  constructor(private checkoutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.checkoutService.getDeliveryWays().subscribe((dm: IDeliveryMethod[]) => {
      this.deliveryMethods = dm;
    }, error => {
      console.log(error);
    })
  }

  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }

  createtIntent() {
    return this.basketService.createtIntent().subscribe((response: any) => {
      this.appStepper.next();
    }, error => {
      console.log(error);
    })
  }
}

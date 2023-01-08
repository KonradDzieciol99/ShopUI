import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { BasketService } from 'src/app/services/basket.service';
import { IBasketTotals } from 'src/app/models/IBasketTotals';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.css']
})
export class CheckoutPageComponent implements OnInit {
  public addressForm = new FormGroup({
    name: new FormControl('', {  validators: [Validators.required] }),
    surName: new FormControl('', { validators: [Validators.required] }),
    street: new FormControl('', {validators: [Validators.required] }),
    city: new FormControl('', { validators: [Validators.required] }),
    state: new FormControl('', {  validators: [Validators.required] }),
    zipCode: new FormControl('', { validators: [Validators.required] }),
    phoneNumber: new FormControl('', { validators: [Validators.required] }),
  });
  public deliveryForm = new FormGroup({
    deliveryMethod: new FormControl('', {  validators: [Validators.required] }),
  });
  public paymentForm = new FormGroup({
    nameOnCard: new FormControl('', {  validators: [Validators.required] }),
  });

  basketTotal$!: Observable<IBasketTotals|undefined>;

  constructor(private fb: FormBuilder, private accountService: AccountService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getDeliveryMethodValue();
    this.basketTotal$ = this.basketService.basketTotal$;
  }

  createCheckoutForm() {

  }

  getDeliveryMethodValue() {
    const basket = this.basketService.basket$.subscribe(basket=>{
      if (basket && basket.deliveryMethodId !== null) {
        this.deliveryForm.get('deliveryMethod')!.patchValue(basket.deliveryMethodId?.toString() ?? null);
      }
    }, error => {
      console.log(error);
    })


  }

}

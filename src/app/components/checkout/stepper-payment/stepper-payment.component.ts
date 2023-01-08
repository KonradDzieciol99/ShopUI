import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/services/basket.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { IBasket } from 'src/app/models/IBasket';
import { IOrderToCreate } from 'src/app/models/IOrderToCreate';

declare var Stripe: any;

@Component({
  selector: 'app-stepper-payment',
  templateUrl: './stepper-payment.component.html',
  styleUrls: ['./stepper-payment.component.css']
})
export class StepperPaymentComponent implements AfterViewInit, OnDestroy{

  @Input() addressForm!: FormGroup;
  @Input() deliveryForm!: FormGroup;
  @Input() paymentForm!: FormGroup;
  @ViewChild('numberOfCard', { static: true }) numberOfCardElement!: ElementRef;
  @ViewChild('dateOfExpirationCard', { static: true }) dateOfExpirationCardElement!: ElementRef;
  @ViewChild('cvcOfCard', { static: true }) cvcOfCardElement!: ElementRef;
  stripe: any;
  numberOfCard: any;
  dateOfExpirationCard: any;
  cvcOfCard: any;
  cardErrors: any;
  cardHandler = this.stripeChangeEvent.bind(this);
  waitTillConfirmLoad = false;
  ValidCreditCardNum = false;
  ValidCreditExpirationTime = false;
  ValidCvcCode = false;

  constructor(private basketService: BasketService,
     private checkoutService: CheckoutService,
    private toastr: ToastrService, private router: Router) { }

  ngAfterViewInit(): void {
    this.initElements();
  }
  initElements():void{
    this.stripe = Stripe('pk_test_51M0T9bCwEUmUQucMcio6m3g2IGxpxLSMngAMMJocXXStGNroLZW7wILnT2pJomuPNeqGwxCRIzjDXIiaec1nZRFm00wGR9gwCZ');
    const elements = this.stripe.elements();

    this.numberOfCard = elements.create('numberOfCard');
    this.numberOfCard.mount(this.numberOfCardElement.nativeElement);
    this.numberOfCard.addEventListener('change', this.cardHandler);

    this.dateOfExpirationCard = elements.create('dateOfExpirationCard');
    this.dateOfExpirationCard.mount(this.dateOfExpirationCardElement.nativeElement);
    this.dateOfExpirationCard.addEventListener('change', this.cardHandler);

    this.cvcOfCard = elements.create('cvcOfCard');
    this.cvcOfCard.mount(this.cvcOfCardElement.nativeElement);
    this.cvcOfCard.addEventListener('change', this.cardHandler);
  }


  stripeChangeEvent(event:any) {
    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }

    if (event.elementType==='numberOfCard') {
      this.ValidCreditCardNum = event.complete;
    }else if (event.elementType==='dateOfExpirationCard') {
      this.ValidCreditExpirationTime = event.complete;
    }else if (event.elementType==='cvcOfCard') {
      this.ValidCvcCode = event.complete;
    }
  }
  async callStripeSubmit(basket:IBasket){
    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmPaymentsStripeSystem(basket);
      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['/success-page'], navigationExtras);      
      } else {
        console.error(paymentResult.error.message);
        this.toastr.error(paymentResult.error.message);
      }
      this.waitTillConfirmLoad = false;
    } catch (error) {
      console.error(error);
      this.waitTillConfirmLoad = false;
    }
  }
  async submitOrder() {
    this.waitTillConfirmLoad = true;
    const basket = this.basketService.getCurrentBasketValue();
    if (!basket) { throw new Error('basket is null');}
    this.callStripeSubmit(basket);
  }

  private async confirmPaymentsStripeSystem(basket:any) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.numberOfCard,
        billing_details: {
          name: this.paymentForm.get('nameOnCard')!.value
        }
      }
    });
  }

  private async createOrder(basket: IBasket) {
    const order = this.getOrder(basket);
    return this.checkoutService.createOrder(order).toPromise();
  }


  private getOrder(basket: IBasket) {
    if (!basket.id) {
      throw new Error('basket.id is empty');
    }
    let orderToCreate:IOrderToCreate={
      basketId: basket.id!,
      deliveryMethodId: +this.deliveryForm!.get('deliveryMethod')!.value,
      shipToAddress: this.addressForm!.value
    };
    return orderToCreate
  }

  ngOnDestroy(): void {
    this.numberOfCard.destroy();
    this.dateOfExpirationCard.destroy();
    this.cvcOfCard.destroy();
  }
}

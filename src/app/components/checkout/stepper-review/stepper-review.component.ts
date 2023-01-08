import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/services/basket.service';
import { IBasket } from 'src/app/models/IBasket';

@Component({
  selector: 'app-stepper-review',
  templateUrl: './stepper-review.component.html',
  styleUrls: ['./stepper-review.component.css']
})
export class StepperReviewComponent implements OnInit {

  @Input() appStepper!: CdkStepper;
  basket$!: Observable<IBasket| undefined>;

  constructor(private basketService: BasketService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
  }

  createtIntent() {
    return this.basketService.createtIntent().subscribe((response: any) => {
      this.appStepper.next();
    }, error => {
      console.log(error);
    })
  }

}

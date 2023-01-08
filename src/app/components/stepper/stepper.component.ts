import { CdkStep, CdkStepper } from '@angular/cdk/stepper';
import { registerLocaleData } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  providers: [{provide: CdkStepper, useExisting: StepperComponent}],

})
export class StepperComponent extends CdkStepper implements OnInit {

  @Input() isLinear: boolean=true;

  ngOnInit(): void {
    this.linear = this.isLinear;
    
    // this.selected=
  }

  onClick(index: number) {
    this.selectedIndex = index;
    console.log(this.selectedIndex);
    
  }

}

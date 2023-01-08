import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-w-v',
  templateUrl: './form-w-v.component.html',
  styleUrls: ['./form-w-v.component.css']
})
export class FormWVComponent implements OnInit {

  @Input()formGroup!: FormGroup;
  @Input() nameFormControl!:string;
  // @Input() validatorsNames:string[]=[];
  @Input() validatorsKeyValue: {key: string, value: string}[]=[];
  @Input() readonly:boolean=true; 

  public edit=false;
  constructor() {
   }

  ngOnInit(): void {
    
  }


}

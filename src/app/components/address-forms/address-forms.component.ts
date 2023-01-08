import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-address-forms',
  templateUrl: './address-forms.component.html',
  styleUrls: ['./address-forms.component.css']
})
export class AddressFormsComponent implements OnInit {

  @Input() addressForm!: FormGroup;
  @Input() readonly:boolean=false;
  
  pathValues(){

  }
  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { IAddress } from 'src/app/models/IAddress';

@Component({
  selector: 'app-stepper-address',
  templateUrl: './stepper-address.component.html',
  styleUrls: ['./stepper-address.component.css']
})
export class StepperAddressComponent implements OnInit {

  @Input() addressForm!: FormGroup;

  savedAddress: IAddress | null | undefined;

  constructor(private accountService: AccountService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getAddressFormValues()
  }

  saveUserAddress() {
    this.accountService.updateUserAddress(this.addressForm!.value).subscribe((address: IAddress) => {
      this.toastr.success('Address saved');
      this.addressForm!.reset(address);
      this.savedAddress=address;
    }, error => {
      this.toastr.error(error.message);
      console.log(error);
    })
  }
  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe(address => {
      console.log(address);
      if (address) {
        // this.checkoutForm.get('addressForm')!.patchValue(address);
        this.addressForm.patchValue(address);
        this.savedAddress=address;
      }
      
    }, error => {
      console.log(error);
    })
  }
  editAddress(){

  }

}

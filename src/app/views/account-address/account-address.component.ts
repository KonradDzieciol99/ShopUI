import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Toast, ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { IAddress } from 'src/app/models/IAddress';
import { User } from 'src/app/models/user';

// interface IAddresForm {
//   name: FormControl<string>;
//   password?: FormControl<string>;
// }

@Component({
  selector: 'app-account-address',
  templateUrl: './account-address.component.html',
  styleUrls: ['./account-address.component.css']
})
export class AccountAddressComponent implements OnInit {

  public readonly:boolean=true;
  private user:User|undefined;
  constructor(private accountService:AccountService,private toastrService:ToastrService ) {
    this.accountService.currentUser$.pipe().subscribe((user: User | undefined)=>{
      this.user=user;
    });
   }
  public addressForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    surName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    street: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    state: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    zipCode: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    phoneNumber: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });
  ngOnInit(): void {
    this.pathValues();
    // this.addressForm.get('name')?.hasError()
    // this.
    this.addressForm.valueChanges.subscribe(x => {
      // console.log(this.addressForm.get('name')?.valid);
    })
  }
  updateAddress(){
    if(!this.addressForm.valid){this.toastrService.warning('form not valid');return; }  
    let address:IAddress ={
      name:this.addressForm.get('name')?.value!,
      surName:this.addressForm.get('surName')?.value!,
      street: this.addressForm.get('street')?.value!,
      city: this.addressForm.get('city')?.value!,
      state: this.addressForm.get('state')?.value!,
      zipCode: this.addressForm.get('zipCode')?.value!,
      phoneNumber: this.addressForm.get('phoneNumber')?.value!
    }

    this.accountService.updateUserAddress(address).subscribe((address: IAddress) => {
      this.toastrService.success('Address saved');
      this.addressForm.reset(address);
    })

  }

  saveUserAddress() {

  }
  pathValues(){
    // this.addressForm.get('email')?.patchValue(this.user?.email ?? null);
    // this.addressForm.get('userName')?.patchValue(this.user?.name ?? null);
    // this.addressForm.get('surName')?.patchValue(this.user?.surName ?? null);
    // this.addressForm.get('phoneNumber')?.patchValue(this.user?.phoneNumber ?? null);
    // this.addressForm.patchValue(this.user)
  this.accountService.getUserAddress().subscribe(address => {
      if (address) {this.addressForm.patchValue(address);}
    });
  }
  // getAddressFormValues() {
  //   this.accountService.getUserAddress().subscribe(address => {
  //     if (address) {
  //       this.checkoutForm.get('addressForm')!.patchValue(address);
  //     }
  //   }, error => {
  //     console.log(error);
  //   })
  // }
}

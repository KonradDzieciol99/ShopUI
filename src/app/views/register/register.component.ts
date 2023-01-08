import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup= new FormGroup({
    email: new FormControl('',[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('',[
      Validators.required])
  });
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }




  constructor(private accountService: AccountService,private router: Router, private toastrService: ToastrService) { }

  ngOnInit(): void {
  }
  onSubmit(form: FormGroup) {
    this.accountService.register(this.registerForm.value.email,this.registerForm.value.password).subscribe(response => {
      this.router.navigateByUrl('/home-page');
      this.toastrService.success("Registered successfully!");
    })
  }

}

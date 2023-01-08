import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public returnUrl: string;

  public loginForm: FormGroup= new FormGroup({
    email: new FormControl('',[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    password: new FormControl('',[
      Validators.required])
  });
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }


  constructor(private accountService: AccountService,private router: Router, private activatedRoute: ActivatedRoute) {
    this.returnUrl="../products-page"
   }

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || this.returnUrl;

  }
  onSubmit(form: FormGroup) {
    this.accountService.login(this.loginForm.value.email,this.loginForm.value.password).subscribe(response => {
      this.router.navigateByUrl(this.returnUrl);
    }, error => {
      console.warn(error);
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { combineLatestWith, firstValueFrom, forkJoin, map, mergeMap, Observable, of, pairwise, pipe, startWith, take } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { IUserDto } from 'src/app/models/IUserDto';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-account-data',
  templateUrl: './account-data.component.html',
  styleUrls: ['./account-data.component.css']
})
export class AccountDataComponent implements OnInit {
onSubmit(arg0: any) {
  console.log("asdas")
}

  test='email'
  public editEmail=false;
  public editPassword=false;
  public editUserName=false;
  public editSurName=false;
  public editPhoneNumber=false;
  public accountDataForm = new FormGroup({
    userName: new FormControl('',[]),
    surName: new FormControl('',[]),
    phoneNumber: new FormControl('',[]),
    email: new FormControl('',[Validators.required,Validators.minLength(6),Validators.email]),
    password: new FormControl('',[Validators.required,Validators.minLength(6)]),
  });

  private user$;
  constructor(private accountService:AccountService,private toastr: ToastrService) {
    this.user$=this.accountService.currentUser$;
   }
  ngOnInit(): void {
    this.pathValues()
  }
  pathValues(){
    this.user$.pipe(take(1)).subscribe((user: User | undefined)=>{
      this.accountDataForm.get('email')?.patchValue(user?.email ?? null);
      this.accountDataForm.get('userName')?.patchValue(user?.name ?? null);
      this.accountDataForm.get('surName')?.patchValue(user?.surName ?? null);
      this.accountDataForm.get('phoneNumber')?.patchValue(user?.phoneNumber ?? null);
    })
  }
  markOut(){
    this.editEmail=false;
    this.editPassword=false;
    this.editUserName=false;
    this.editSurName=false;
    this.editPhoneNumber=false;
  }
}

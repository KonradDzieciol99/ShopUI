import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, mergeMap, of, switchMap, take, throwError } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-user-data-container',
  templateUrl: './user-data-container.component.html',
  styleUrls: ['./user-data-container.component.css']
})
export class UserDataContainerComponent implements OnInit {
  @Input()formGroup!: FormGroup;
  @Input() nameFormControl!:string;
  @Input() validatorsNames:string[]=[];
  @Output() cancelEvent = new EventEmitter<void>();

  public edit=false;
  constructor(private accountService:AccountService,public toastrService:ToastrService) { }

  ngOnInit(): void {
    
  }
  updateData(){
    this.accountService.updateDataTEST(this.formGroup).subscribe({  
      next: user => {this.toastrService.success('succes'),this.edit=false;},  
      error: err => {this.toastrService.warning(err)},  
    })
  }
  cancel(){
    this.cancelEvent.emit();
  }
}

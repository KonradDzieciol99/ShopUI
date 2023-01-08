import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.css']
})
export class CreateBrandComponent implements OnInit {

  public brandCreateForm = new FormGroup({
    brandName: new FormControl('',[
      Validators.required,
      Validators.minLength(3)])
  });

  get brandName() { return this.brandCreateForm.get('brandName'); }

  constructor(private adminService:AdminService,private toastrService:ToastrService ) { }

  ngOnInit(): void {
  }

  create(){
    let value=this.brandCreateForm.get('brandName')?.value
    if (!value) {return }
    this.adminService.addBrand(value).subscribe(x=>{
      this.toastrService.success('dodano brand')
    });
  }

}

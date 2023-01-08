import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';


@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css']
})
export class CreateCategoryComponent implements OnInit {

  public categoryCreateForm = new FormGroup({
    categoryName: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
      Validators.pattern('^[a-zA-Z \-\']+')])

  });

  get categoryName() { return this.categoryCreateForm.get('categoryName'); }


  constructor(private adminService:AdminService,private toastrService:ToastrService ) { }

  ngOnInit(): void {
  }
  create(){
    let value=this.categoryCreateForm.get('categoryName')?.value
    if (!value) {return }
    this.adminService.addCategory(value).subscribe(x=>{
      this.toastrService.success('dodano category')
    });
  }
}

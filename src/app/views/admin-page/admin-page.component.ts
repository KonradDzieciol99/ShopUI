import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ProductsService } from 'src/app/services/products.service';
import { ICreateProduct } from 'src/app/models/ICreateProduct';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent implements OnInit {
  active = 1;
  fileName:string|undefined;
  selectedImageURL: string|undefined;
  imageURLs: string[]=[];
  public productCreateForm = new FormGroup({
    productName: new FormControl<string|undefined>(undefined,[Validators.required]),
    price: new FormControl<number|undefined>(undefined,[Validators.required]),
    description: new FormControl<string|undefined>(undefined,[Validators.required]),
    quantity: new FormControl<number|undefined>(undefined,[Validators.required]),
    files: new FormControl<File[]|undefined>(undefined ,[Validators.required]),
    mainPhotoIndex: new FormControl<number|undefined>(undefined,[Validators.required]),
  });

  constructor(private productService:ProductsService,private adminService:AdminService,private toastrService:ToastrService) {}
  ngOnInit(): void {
    this.selectedImageURL?.length
  }
  formFileInputEvent(event:any){
    
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImageURL = reader.result as string;
      this.imageURLs.push(reader.result as string);

      let fileList = this.productCreateForm.get('files')?.value
      if (fileList){
        fileList.push(file)
        this.productCreateForm.get('mainPhotoIndex')?.setValue(fileList.length-1)
      }
      else{
        fileList=[file];
        this.productCreateForm.get('mainPhotoIndex')?.setValue(1)
      }
      this.productCreateForm.get('files')?.setValue(fileList);
    }

    reader.readAsDataURL(file)
  }

  removePhoto(photoURL:string,index:number){
    let list = this.productCreateForm.get('files')?.value;
    if (!list) {throw new Error("List is empty")};
    list.splice(index,1)

    this.imageURLs.splice(index,1);
    if (this.selectedImageURL===photoURL) {
      if (this.imageURLs[index-1])
      {
        this.selectedImageURL=this.imageURLs[index-1]
        this.productCreateForm.get('mainPhotoIndex')?.setValue(index-1)
      } 
      else if(this.imageURLs[index+1])
      {
        this.selectedImageURL=this.imageURLs[index+1]
        this.productCreateForm.get('mainPhotoIndex')?.setValue(index+1)
      }
      else{
        this.selectedImageURL=undefined;
        this.productCreateForm.get('mainPhotoIndex')?.setValue(undefined)
      }
    }
    console.log(list);
    console.log(this.imageURLs);
  }
  addProduct(){
    const formData: FormData = new FormData();
    
    if (!this.productCreateForm.valid) {
      throw new Error('no valid')
    }

    for (var file of this.productCreateForm.get('files')?.value!) {
      formData.append('Files',file);
    }
    formData.append('productName', this.productCreateForm.get('productName')?.value!);
    formData.append('price', this.productCreateForm.get('price')?.value!.toString()!);
    formData.append('description', this.productCreateForm.get('description')?.value!);
    formData.append('quantity', this.productCreateForm.get('quantity')?.value!.toString()!);
    formData.append('mainPhotoIndex', this.productCreateForm.get('mainPhotoIndex')?.value!.toString()!);

    this.adminService.addProduct(formData)
  }
}
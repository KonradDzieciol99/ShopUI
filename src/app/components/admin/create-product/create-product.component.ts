import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { IBrandOfProduct } from 'src/app/models/IBrandOfProduct';
import { ICategoryOfProduct } from 'src/app/models/ICategoryOfProduct';
import { AdminService } from 'src/app/services/admin.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  brands:IBrandOfProduct[]|undefined;
  category:ICategoryOfProduct[]|undefined;
  fileName:string|undefined;
  selectedImageURL: string|undefined;
  imageURLs: string[]=[];
  // fileList: File[] = [];

  public productCreateForm = new FormGroup({
    productName: new FormControl('',[
      Validators.required,
      Validators.minLength(3)]),
    price: new FormControl('',[
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]),
    cutPrice: new FormControl('',[
      Validators.min(1),
      Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]),
    description: new FormControl('',[
      Validators.required,
      Validators.minLength(10)]),
    quantity: new FormControl('',[
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)]),
    files: new FormControl<File[]|undefined>(undefined ,[Validators.required]),
    mainPhotoIndex: new FormControl<number|undefined>(undefined,[Validators.required]),
    brands: new FormControl<IBrandOfProduct|undefined>(undefined,[Validators.required]),
    category: new FormControl<ICategoryOfProduct|undefined>(undefined,[Validators.required]),
  });

  get productName() { return this.productCreateForm.get('productName'); }
  get description() { return this.productCreateForm.get('description'); }
  get price() { return this.productCreateForm.get('price'); }
  get quantity() { return this.productCreateForm.get('quantity'); }
  get cutPrice() { return this.productCreateForm.get('cutPrice'); }




  constructor(private productService:ProductsService,private adminService:AdminService,private toastrService:ToastrService) {}
  ngOnInit(): void {
    // this.selectedImageURL?.length
    this.getBrand();
    this.getCategory();
  }
  formFileInputEvent(event:any){
    

    const file = event.target.files[0];

    const reader = new FileReader();

    reader.onload = () => {
      this.selectedImageURL = reader.result as string;
      this.imageURLs.push(reader.result as string);
      // this.fileList.push(file);
      // const fileList: File[] = []
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
      if (this.imageURLs[index-1])//exist
      {
        this.selectedImageURL=this.imageURLs[index-1]
        this.productCreateForm.get('mainPhotoIndex')?.setValue(index-1)
      } 
      else if(this.imageURLs[index+1])//exist
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
    if (this.productCreateForm.get('cutPrice')?.value) {
      formData.append('cutPrice', this.productCreateForm.get('cutPrice')?.value!.toString()!)
    }
    formData.append('productName', this.productCreateForm.get('productName')?.value!);
    formData.append('price', this.productCreateForm.get('price')?.value!.toString()!);
    formData.append('description', this.productCreateForm.get('description')?.value!);
    formData.append('quantity', this.productCreateForm.get('quantity')?.value!.toString()!);
    formData.append('mainPhotoIndex', this.productCreateForm.get('mainPhotoIndex')?.value!.toString()!);

    formData.append('BrandOfProductId', this.productCreateForm.get('brands')?.value?.id?.toString()!);
    formData.append('CategoryOfProductId', this.productCreateForm.get('category')?.value!.id?.toString()!);
    this.adminService.addProduct(formData).pipe(take(1)).subscribe(() => {
      this.toastrService.success("Dodano produkt");
    });;
  }
  getBrand(){
    this.productService.getBrand().pipe(take(1)).subscribe(brands=>{
      // this.productCreateForm.get('brands')?.setValue(brands);
      this.brands=brands;
      console.log(brands);
    })
  }
  getCategory(){
    this.productService.getCatrories().pipe(take(1)).subscribe(cateries=>{
      // this.productCreateForm.get('brands')?.setValue(brands);
      this.category=cateries;
      console.log(cateries);
    })
  }

}

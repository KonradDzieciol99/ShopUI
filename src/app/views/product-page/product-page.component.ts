import { Component, OnInit } from '@angular/core';
import { concatWith, Observable, take } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { Pagination } from 'src/app/models/pagination';
import { IProduct } from 'src/app/models/IProduct';
import { ProductParams } from 'src/app/models/productParams';
import { BasketService } from 'src/app/services/basket.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IBrandOfProduct } from 'src/app/models/IBrandOfProduct';
import { ICategoryOfProduct } from 'src/app/models/ICategoryOfProduct';


@Component({
  selector: 'app-product-page',
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.css']
})
export class ProductPageComponent implements OnInit {
  product:IProduct|undefined;
  constructor(private productService:ProductsService,
    private basketService: BasketService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute) {
    this.getproduct();
  }

  ngOnInit(): void {
   

  }
  getproduct(){
    let id = this.activatedRoute.snapshot.params['id'] as number;
    this.productService.getById(id).pipe(take(1)).subscribe(resoult=>{
      this.product=resoult;
      var c = this.product?.photos?.length === 1;
      console.log();
    });
 
  }
  addItemToBasket(product:IProduct){
    this.basketService.addItemToBasket(product);
    this.toastr.success('Item added')
  }
  
}

import { Component, OnInit } from '@angular/core';
import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { take } from 'rxjs';
import { IProduct } from 'src/app/models/IProduct';
import { ProductsService } from 'src/app/services/products.service';
import { BasketService } from 'src/app/services/basket.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ICategoryOfProduct } from 'src/app/models/ICategoryOfProduct';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  constructor(private productsService:ProductsService, private basketService: BasketService,private toastr: ToastrService) {}
  ngOnInit(){
    this.getOnSale();
  }

  addItemToBasket(product:IProduct){
    this.basketService.addItemToBasket(product);
    this.toastr.success('Item added')
  }
  
  activeSlides?: SlidesOutputData;
  getPassedData(data: SlidesOutputData) {
    this.activeSlides = data;
    console.log(this.activeSlides);
  }
  getOnSale(){
    this.productsService.getOnSale().pipe(take(1)).subscribe(response=>{
      this.ProductOnSale=response.list;
    })
  }
  ProductOnSale:IProduct[]=[]
  BestOfProduct:IProduct[]=[]
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      760: {
        items: 3,
      },
      1000: {
        items: 4,
      },
    },
    nav: true,
  };
}

import { Component, OnInit } from '@angular/core';
import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { IProduct } from 'src/app/models/IProduct';
import { ProductsService } from 'src/app/services/products.service';
import { BasketService } from 'src/app/services/basket.service';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, take } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { GeneralStateService } from 'src/app/services/general-state.service';
import { User } from 'src/app/models/user';
import { ICategoryOfProduct } from 'src/app/models/ICategoryOfProduct';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IContactMessage } from 'src/app/models/IContactMessage';
import { ContactService } from 'src/app/services/contact.service';




@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  activeSlides?: SlidesOutputData;

  contactForm: FormGroup = new FormGroup({
    email: new FormControl('',[
      Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    name: new FormControl<string>('',[Validators.required,Validators.minLength(5)]),
    subject: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]),
    message: new FormControl('',[
      Validators.required,
      Validators.minLength(10)]),
  });
  get email() { return this.contactForm.get('email'); }
  get subject() { return this.contactForm.get('subject'); }
  get message() { return this.contactForm.get('message'); }

  InfoDynamicSlides = [
    {
      id: 1,
      src: '../photos/eee.jpg',
      alt: 'img 1',
      // title: 'Side 1',
    },
    {
      id: 2,
      src: '../photos/ad2.jpg',
      alt: 'img2',
      title: 'Side 2',
    }
  ];

  
  InfoCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1,
      },
    },
    nav: true,
  };

  BestOfProduct: IProduct[] = []

  categories :  ICategoryOfProduct[]|undefined;

  dynamicSlides = [

  ];
  constructor(private contactService:ContactService,
    private productService: ProductsService,
    private basketService: BasketService,
    private toastrService: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

  }

  getCategories() {
    this.productService.getCatrories().pipe(take(1)).subscribe(categories => {
      this.categories = categories;
    })
  }
  onClick() {
    this.router.navigate(['/products-page'], { queryParams: { categories: 'asd' } })
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    navText: ['&#8249', '&#8250;'],
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
  getPassedData(data: SlidesOutputData) {
    this.activeSlides = data;
  }
  getData(data: SlidesOutputData) {
    console.log(data);
  }
  addItemToBasket(product: IProduct) {
    this.basketService.addItemToBasket(product);
    this.toastrService.success('Item added')
  }

  ngOnInit(): void {
    this.getCategories();
  }
  onContactMessageSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched()
      return;
    }
    let contactMessage:IContactMessage={
      email: this.contactForm.get("email")?.value,
      name: this.contactForm.get("name")?.value,
      subject: this.contactForm.get("subject")?.value,
      message: this.contactForm.get("message")?.value,
    }
    this.contactService.sendContactMessage(contactMessage).pipe(take(1)).subscribe(() => {
        this.toastrService.success("Wysłano wiadomość");
    });
  }
}



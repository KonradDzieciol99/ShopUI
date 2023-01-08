import { Component, Input, OnInit } from '@angular/core';
import {
  combineLatest,
  concatWith,
  forkJoin,
  fromEvent,
  map,
  merge,
  mergeMap,
  mergeWith,
  Observable,
  of,
  take,
  zip,
} from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';
import { Pagination } from 'src/app/models/pagination';
import { IProduct } from 'src/app/models/IProduct';
import { ProductParams } from 'src/app/models/productParams';
import { BasketService } from 'src/app/services/basket.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IBrandOfProduct,
  IBrandOfProductCheckbox,
} from 'src/app/models/IBrandOfProduct';
import {
  ICategoryOfProduct,
  ICategoryOfProductCheckbox,
} from 'src/app/models/ICategoryOfProduct';
import { Router } from '@angular/router';
import { IQueryParametersAggregate } from 'src/app/models/IQueryParametersAggregate';
import { ISortOptions } from 'src/app/models/ISortOptions';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css'],
})
export class ProductsPageComponent implements OnInit {
  sortOptions: ISortOptions[] = [
    {
      name: 'Alphabetical: Low to high',
      orderByfield: 'productName',
      orderAscending: true,
    },
    {
      name: 'Alphabetical: High to low',
      orderByfield: 'productName',
      orderAscending: false,
    },
    { name: 'Price: Low to high', orderByfield: 'price', orderAscending: true },
    {
      name: 'Price: High to low',
      orderByfield: 'price',
      orderAscending: false,
    },
  ];
  categoriesCheckbox: ICategoryOfProductCheckbox[] = [];
  brandsCheckbox: IBrandOfProductCheckbox[] = [];
  products: IProduct[] = [];
  sortForm = new FormControl(this.sortOptions[0]);
  currentPagination: Pagination = new Pagination();
  public priceForm = new FormGroup({
    priceFrom: new FormControl<number | undefined>(undefined),
    priceTo: new FormControl<number | undefined>(undefined),
  });
  public brandsForm = new FormGroup({
    selectedBrands: new FormArray([]),
  });
  public categoriesForm = new FormGroup({
    selectedCategories: new FormArray([]),
  });
  categoryForm = this.fb.group({
    todestory: this.fb.array([]),
  });
  get selectedBrands() {
    return this.brandsForm.get('selectedBrands') as FormArray;
  }
  get selectedCategories() {
    return this.categoriesForm.get('selectedCategories') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private productService: ProductsService,
    private basketService: BasketService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  createQueryParametersAggregate(queryParams:Params):IQueryParametersAggregate{

    let queryParametersAggregate = new IQueryParametersAggregate(
      queryParams['search'],
      queryParams['priceFrom'],
      queryParams['priceTo'],
      queryParams['categories'],
      queryParams['brands'],
      queryParams['orderByfield'],
      queryParams['orderAscending'],
      );
    
    return queryParametersAggregate
  }
  mapParamsToForms() {
    return this.activatedRoute.queryParams.pipe(
      take(1)
      ,map((queryParams) => {

        const queryParametersAggregate = this.createQueryParametersAggregate(queryParams);

        let rawCategoriesParams = queryParametersAggregate.categories;
        if (rawCategoriesParams) {
          for (let iterator of rawCategoriesParams) {
            var category = this.categoriesCheckbox.find((x) => x.categoryName == iterator);
            const checkArray: FormArray = this.categoriesForm.get( 'selectedCategories') as FormArray;

            checkArray.controls.forEach((item,i) => {
              if (item.value == category) {
                checkArray.at(i).value.checked = true;
                return;
              }
            });
          }
        }

        let rawBrandsParams = queryParametersAggregate.brands;
        if (rawBrandsParams) {
          for (let iterator of rawBrandsParams) {
            var brand = this.brandsCheckbox.find(
              (x) => x.brandName == iterator
            );

            const checkArray: FormArray = this.brandsForm.get(
              'selectedBrands'
            ) as FormArray;
            checkArray.controls.forEach((item,i) => {
              if (item.value == brand) {
                checkArray.at(i).value.checked = true;
                return;
              }
            });
          }
        } 

        let priceFrom = queryParametersAggregate.priceFrom;
        if (priceFrom && parseInt(priceFrom)) {
          this.priceForm.controls.priceFrom.setValue(parseInt(priceFrom), {emitEvent: false,});
        }
        let priceTo = queryParametersAggregate.priceTo;
        if (priceTo) {
          this.priceForm.controls.priceTo.setValue(parseInt(priceTo), {emitEvent: false,});
        }
        let orderByfield = queryParametersAggregate.orderByfield;
        let orderAscending = queryParametersAggregate.orderAscending;

        if ( orderAscending && (orderAscending === 'true' || orderAscending === 'false')  && orderByfield) {
          let orderAscendingBoolean:boolean;
          orderAscending==='true' ? orderAscendingBoolean=true : orderAscendingBoolean=false;
          var sortOption = this.sortOptions.find(x => {
            return (x.orderAscending == orderAscendingBoolean && x.orderByfield == orderByfield);
          });
          if (sortOption) {
            this.sortForm.setValue(sortOption);
          }
        }
      })
    );
    //end //czyli wystarczy że będzie jedno przed bo nie da się zmienić manulanie params bo sie cała strona odswieża
  }
  ngOnInit(): void {
    this.priceForm.valueChanges.subscribe((x) => {
      let allData = this.donwloadFromForms();
      this.router.navigate(['../products-page'], { queryParams: allData });
    });

    this.productService.currentPagination$.subscribe((next) => {
      this.currentPagination = next;
    });

    forkJoin({
      requestOne: this.getCategories(),
      requesttwo: this.getBrands(),
    })
    .pipe(
      mergeMap(() => this.mapParamsToForms())
    ).subscribe(() => {
      this.subParams();
    });
  }
  subParams() {
    this.activatedRoute.queryParams.pipe().subscribe((queryParams) => {
      let paramsP: ProductParams = this.productService.getParams();
      paramsP = new ProductParams();

      const queryParametersAggregate: IQueryParametersAggregate = this.createQueryParametersAggregate(queryParams);

      paramsP.minPrice = parseInt(queryParametersAggregate.priceFrom  ?? "");
      paramsP.maxPrice = parseInt(queryParametersAggregate.priceTo ?? "");
      paramsP.search = queryParametersAggregate.search;
      paramsP.orderByfield = queryParametersAggregate.orderByfield;

      let orderAscending = queryParametersAggregate.orderAscending;
      if( orderAscending === 'true' || orderAscending === 'false' ) {
        orderAscending==='true' ? paramsP.orderAscending=true : paramsP.orderAscending=false;
      }

      const categories = queryParametersAggregate.categories;
      let catArray:string[]=[];
      if(categories){
        if (categories instanceof Array<string>) {
          catArray=categories
        }
        else
        {catArray.push(categories)}
        paramsP.categories=[];
        for (const iterator of catArray) {
          let category=this.categoriesCheckbox.find(x=>x.categoryName===iterator);
          if (category) {
            paramsP.categories.push(category)
          }
        }
      }
      
      const brands = queryParametersAggregate.brands;
      let brandArray:string[]=[];
      if(brands){
        if (brands instanceof Array<string>) {
          brandArray=brands
        }
        else
        {brandArray.push(brands)}
        paramsP.brands=[];
        for (const iterator of brandArray) {
          let brand=this.brandsCheckbox.find(x=>x.brandName===iterator);
          if (brand) {
            paramsP.brands.push(brand)
          }
        }
      }

      this.productService.setShopParams(paramsP);
      this.getproducts();
    });
  }
  getproducts() {
    this.productService
      .get()
      .pipe(take(1))
      .subscribe((resoult) => {
        this.products = resoult.list;
      });
  }

  onBrandCheckboxChange(e: any) {
    const checkArray: FormArray = this.brandsForm.get(
      'selectedBrands'
    ) as FormArray;
    if (e.target.checked) {
      checkArray.controls.forEach((item,i) => {
        if (item.value.brandName == e.target.value) {
          checkArray.at(i).value.checked = true;
          return;
        }
      });
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item,i) => {
        if (item.value.brandName == e.target.value) {
          checkArray.at(i).value.checked = false;
          return;
        }
      });
    }
    let allData = this.donwloadFromForms();
    this.router.navigate(['../products-page'], { queryParams: allData });
  }
  onCategoryCheckboxChange(e: any) {
    const checkArray: FormArray = this.categoriesForm.get('selectedCategories') as FormArray;
    if (e.target.checked) {
      checkArray.controls.forEach((item,i) => {
        if (item.value.categoryName == e.target.value) {
          checkArray.at(i).value.checked = true;
          return;
        }
      });
    } else {
      checkArray.controls.forEach((item,i) => {
        if (item.value.categoryName == e.target.value) {
          checkArray.at(i).value.checked = false;
          return;
        }
      });
    }
    let allData = this.donwloadFromForms();
    this.router.navigate(['../products-page'], { queryParams: allData });
  }
  donwloadFromForms() {
    let priceFrom = this.priceForm.get('priceFrom')?.value?.toString();
    let priceTo = this.priceForm.get('priceTo')?.value?.toString();
    let categories: string[] | undefined;
    let brands: string[] | undefined;
    let orderByfield = this.sortForm.value?.orderByfield;
    let orderAscending = this.sortForm.value?.orderAscending?.toString();
    let paramsP: ProductParams = this.productService.getParams();
    let querySearch = paramsP.search;

    var formArray = this.categoriesForm.get('selectedCategories') as FormArray;
    formArray.controls.forEach((item) => {
      if (item.value.checked == true) {
        categories === undefined
          ? (categories = [item.value.categoryName])
          : categories.push(item.value.categoryName);
      }
    });

    var formArraybrandsForm = this.brandsForm.get(
      'selectedBrands'
    ) as FormArray;
    formArraybrandsForm.controls.forEach((item) => {
      if (item.value.checked == true) {
        brands === undefined
          ? (brands = [item.value.brandName])
          : brands.push(item.value.brandName);
      }
    });

    let queryParametersAggregate: IQueryParametersAggregate = {
      priceFrom: priceFrom,
      priceTo: priceTo,
      categories: categories,
      brands: brands,
      orderByfield: orderByfield,
      orderAscending: orderAscending,
      search: querySearch,
    };
    return queryParametersAggregate;
  }
  getBrands() {
    return this.productService
      .getBrand()
      .pipe(
        take(1)
        ,map((brands) => {
          var formArray = this.brandsForm.get('selectedBrands') as FormArray;
          for (let item of brands) {
            let itemCheckbox: IBrandOfProductCheckbox = {
              checked: false,
              id: item.id,
              brandName: item.brandName,
            };
            this.brandsCheckbox.push(itemCheckbox);
            const formControl = new FormControl(itemCheckbox);
            formArray.push(formControl);
          }
        })
      );
  }
  getCategories() {
    return this.productService.getCatrories().pipe(
      take(1)
      ,map((categories) => {
        var formArray = this.categoriesForm.get('selectedCategories') as FormArray;
        for (let item of categories) {
          let itemCheckbox: ICategoryOfProductCheckbox = {
            checked: false,
            id: item.id,
            categoryName: item.categoryName,
          };
          this.categoriesCheckbox.push(itemCheckbox);
          const formControl = new FormControl(itemCheckbox);
          formArray.push(formControl);
        }
      })
    );
  }
  pageChanged(event: number) {
    const params = this.productService.getParams();
    params.pageNumber = event;
    this.productService.setShopParams(params);
    this.getproducts();
  }
  addItemToBasket(product: IProduct) {
    this.basketService.addItemToBasket(product);
    this.toastr.success('Item added');
  }
  onSortSelected() {
    if (!this.sortForm.value) {
      return;
    }
    const params = this.productService.getParams();
    params.orderByfield = this.sortForm.value?.orderByfield;
    params.orderAscending = this.sortForm.value?.orderAscending;

    let allData = this.donwloadFromForms();
    this.router.navigate(['../products-page'], { queryParams: allData });
  }
}

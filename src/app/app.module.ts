import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { HomePageComponent } from './views/home-page/home-page.component';
import { ProductsPageComponent } from './views/products-page/products-page.component';
import { ProductPageComponent } from './views/product-page/product-page.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HasRoleDirective } from './directives/has-role.directive';
import { AdminPageComponent } from './views/admin-page/admin-page.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BasketComponent } from './views/basket/basket.component';
import { JwtInterceptorInterceptor } from './interceptors/jwt-interceptor.interceptor';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { BasketItemCardComponent } from './components/basket-item-card/basket-item-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ErrorHandlingInterceptor } from './interceptors/error-handling.interceptor';
import { CheckoutPageComponent } from './views/checkout-page/checkout-page.component';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { StepperComponent } from './components/stepper/stepper.component';
import { StepperAddressComponent } from './components/checkout/stepper-address/stepper-address.component';
import { StepperDeliveryComponent } from './components/checkout/stepper-delivery/stepper-delivery.component';
import { StepperPaymentComponent } from './components/checkout/stepper-payment/stepper-payment.component';
import { StepperReviewComponent } from './components/checkout/stepper-review/stepper-review.component';
import { SuccessComponent } from './components/checkout/success/success.component';
import { OrdersComponent } from './views/orders/orders.component';
import { OrderComponent } from './views/order/order.component';
import { AccountDataComponent } from './views/account-data/account-data.component';
import { UserDataContainerComponent } from './components/user-data-container/user-data-container.component';
import { AccountAddressComponent } from './views/account-address/account-address.component';
import { FormWVComponent } from './components/form-w-v/form-w-v.component';
import { BasketSummaryComponent } from './components/basket-summary/basket-summary.component';
import { AddressFormsComponent } from './components/address-forms/address-forms.component';
import { FooterComponent } from './views/footer/footer.component';
import { CreateProductComponent } from './components/admin/create-product/create-product.component';
import { CreateCategoryComponent } from './components/admin/create-category/create-category.component';
import { CreateBrandComponent } from './components/admin/create-brand/create-brand.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CarouselOwlHolderComponent } from './views/carousel-owl-holder/carousel-owl-holder.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HomePageComponent,
    ProductsPageComponent,
    ProductPageComponent,
    NotFoundComponent,
    NavBarComponent,
    HasRoleDirective,
    AdminPageComponent,
    LoginComponent,
    RegisterComponent,
    BasketComponent,
    ProductCardComponent,
    BasketItemCardComponent,
    CheckoutPageComponent,
    StepperComponent,
    StepperAddressComponent,
    StepperDeliveryComponent,
    StepperPaymentComponent,
    StepperReviewComponent,
    SuccessComponent,
    OrdersComponent,
    OrderComponent,
    AccountDataComponent,
    UserDataContainerComponent,
    AccountAddressComponent,
    FormWVComponent,
    BasketSummaryComponent,
    AddressFormsComponent,
    FooterComponent,
    CreateProductComponent,
    CreateCategoryComponent,
    CreateBrandComponent,
    CarouselOwlHolderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    CdkStepperModule,
    CarouselModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

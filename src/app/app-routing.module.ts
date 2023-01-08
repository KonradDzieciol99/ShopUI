import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuccessComponent } from './components/checkout/success/success.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { BasketGuard } from './guards/basket.guard';
import { AccountAddressComponent } from './views/account-address/account-address.component';
import { AccountDataComponent } from './views/account-data/account-data.component';
import { AdminPageComponent } from './views/admin-page/admin-page.component';
import { BasketComponent } from './views/basket/basket.component';
import { CarouselOwlHolderComponent } from './views/carousel-owl-holder/carousel-owl-holder.component';
import { CheckoutPageComponent } from './views/checkout-page/checkout-page.component';
import { FooterComponent } from './views/footer/footer.component';
import { HomePageComponent } from './views/home-page/home-page.component';
import { LandingPageComponent } from './views/landing-page/landing-page.component';
import { LoginComponent } from './views/login/login.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { OrderComponent } from './views/order/order.component';
import { OrdersComponent } from './views/orders/orders.component';
import { ProductPageComponent } from './views/product-page/product-page.component';
import { ProductsPageComponent } from './views/products-page/products-page.component';
import { RegisterComponent } from './views/register/register.component';

const routes: Routes = [

  { path: "account/address", component: AccountAddressComponent, runGuardsAndResolvers: 'always', canActivate: [AuthorizationGuard],},
  { path: "account", component: AccountDataComponent, runGuardsAndResolvers: 'always', canActivate: [AuthorizationGuard],},
  { path: "order/:id", component: OrderComponent, runGuardsAndResolvers: 'always', canActivate: [AuthorizationGuard],},
  { path: "orders", component: OrdersComponent, runGuardsAndResolvers: 'always', canActivate: [AuthorizationGuard],},
  { path: "success-page", component: SuccessComponent},
  { path: "checkout-page", runGuardsAndResolvers: 'always', canActivate: [AuthorizationGuard,BasketGuard], component: CheckoutPageComponent},
  { path: "home-page", component: HomePageComponent},
  { path: "landing-page", component: LandingPageComponent},
  { path: "products-page", component: ProductsPageComponent},
  { path: "admin-page", runGuardsAndResolvers: 'always',canActivate: [AdminGuard], component: AdminPageComponent},
  { path: "product-page/:id", component: ProductPageComponent},
  { path: 'not-found', component: NotFoundComponent},
  { path: "login", component: LoginComponent },
  { path: "basket-page", component: BasketComponent },
  { path: "register", component: RegisterComponent },
  { path: "footer", component: FooterComponent},
  {path: "carousel", component: CarouselOwlHolderComponent},
  { path: "", redirectTo: "landing-page", pathMatch: "full"},
  { path: "**", redirectTo: "landing-page", pathMatch: "full"},
  { path: "**", redirectTo: "landing-page", pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


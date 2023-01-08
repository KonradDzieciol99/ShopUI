import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, take } from 'rxjs';
import { BasketService } from '../services/basket.service';

@Injectable({
  providedIn: 'root'
})
export class BasketGuard implements CanActivate {
  constructor(private basketService: BasketService,private toastrService:ToastrService) {
  }

  canActivate(
    
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      console.log("clicl2")
    return this.basketService.basket$.pipe(
      take(1),
      map(basket => {
        if (basket?.basketItems?.length == 0 ) {
          this.toastrService.warning('Empty basket')
          return false;     
        }        
        return true;
      })
    )
  }
  
}

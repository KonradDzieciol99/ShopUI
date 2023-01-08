import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationGuard implements CanActivate {

  constructor(private accountService: AccountService, private router: Router) {
  }

  canActivate(
    
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      console.log("clicl")
    return this.accountService.currentUser$.pipe(
      take(1),
      map((auth:User|undefined) => {
        if (auth) {
          return true;
        }
        this.router.navigate(['../login'], {queryParams: {returnUrl: state.url}})
        return false;
      })
    )
  }
  
}

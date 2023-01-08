import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AccountService } from '../services/account.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private accountService: AccountService) {
   }

  canActivate(): Observable<boolean> {
    return this.accountService.currentUser$.pipe(
      map((user: User|undefined) => {
        if (user?.roles.includes('Admin') || user?.roles.includes('Moderator')) {
          return true;
        }
        console.warn("You cannot enter this area")
        return false;
      })
    )
  }

  
  
}

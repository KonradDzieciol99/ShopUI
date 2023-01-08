import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AccountService } from './account.service';
import { BasketService } from './basket.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralStateService implements OnInit {

  constructor(private http: HttpClient,private accountService:AccountService,private basketService:BasketService ) {
    this.accountService.currentUser$.subscribe
  }
  
  ngOnInit(): void {}
  clearState() {
    this.accountService.logout();
    this.basketService.removeLocalBasket()
  }

}

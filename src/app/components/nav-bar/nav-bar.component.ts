import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AccountService } from 'src/app/services/account.service';
import { BasketService } from 'src/app/services/basket.service';
import { GeneralStateService } from 'src/app/services/general-state.service';
import { IBasket } from 'src/app/models/IBasket';
import { ProductParams } from 'src/app/models/productParams';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public BasktemItemsCount: Observable<number>
  public user:User|undefined;
  public searchPhrase = new FormControl('',[Validators.required]);
  public isMenuCollapsed = true;

  constructor(private generalStateService:GeneralStateService,public accountService:AccountService,private router: Router,private basketService:BasketService) {
    this.BasktemItemsCount=this.basketService.basket$.pipe(map(IBasket=>{
      var count:number = 0;
      if (IBasket?.basketItems) {
        for (var val of IBasket.basketItems) {
          count=count+val.quantity;
        }
      }
      return count;
    }));
   }
   onSearch() {
    let searchPhraseTemp=this.searchPhrase.value;
    if (!searchPhraseTemp || !this.searchPhrase.valid) {return}
    this.router.navigate(['../products-page'], {queryParams: {search: searchPhraseTemp},  queryParamsHandling: "merge"})
  }

  onReset() {
    this.router.navigate(['../products-page'], {queryParams: {search: undefined}})
    this.searchPhrase?.setValue(null);
  }
  ngOnInit(): void {
    this.accountService.currentUser$.subscribe((user: User | undefined)=>{
      this.user=user;
    });
  }
  login() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    this.generalStateService.clearState();
    this.router.navigateByUrl('/')
  }

}

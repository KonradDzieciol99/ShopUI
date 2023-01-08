import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from './services/account.service';
import { BasketService } from './services/basket.service';
import { IBasket } from './models/IBasket';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ShopUISkeleton';

  constructor(private accountService: AccountService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser():void {
    let itemUser=localStorage.getItem('user')
    if (!itemUser) { return;}
    
    const user: User|null = JSON.parse(itemUser);
    if (user) {
      this.accountService.setCurrentUser(user);
    }
  }
}

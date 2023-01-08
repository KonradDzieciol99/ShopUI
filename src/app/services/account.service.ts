import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, merge, mergeMap, of, ReplaySubject, take, tap, zip } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAddress } from '../models/IAddress';
import { IUserDto } from '../models/IUserDto';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<User|undefined>(undefined);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient) { }

  login(email: string,password: string) {
    return this.http.post<User>(this.baseUrl + 'account/login', {Email:email,Password:password}).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  register(email: string,password: string) {
    return this.http.post<User>(this.baseUrl + 'account/register', {Email:email,Password:password}).pipe(
      tap((user: User) => {
        if (user) {
        this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user: User) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
  getUserAddress() {
    return this.http.get<IAddress|null>(this.baseUrl + 'account/address');
  }

  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + 'account/address', address);
  }
  updateUserData(userData: IUserDto) {
    return this.http.put<IUserDto>(this.baseUrl + 'account/data', userData).pipe(
      mergeMap(response=>{
          return zip([this.currentUser$.pipe(take(1)),of(response)],(user,response) =>{return {user,response}})
        }
      ),
      map(zipZ=>{
        if(!zipZ.user){throw new Error('nie jesteś zalogowany');}
        let user:User={
          token: zipZ.user.token,
          roles: zipZ.user.roles,
          email: zipZ.user.email,
          surName:zipZ.response.surName,
          name:zipZ.response.name,
          phoneNumber:zipZ.response.phoneNumber,
        }
        this.setCurrentUser(user);
      })
    );
  }
  findDifferencesIUsersDto(prev:IUserDto,next:IUserDto){
    let userDto:IUserDto ={
      email:prev.email==next.email ? undefined : next.email ,
      phoneNumber:prev.phoneNumber==next.phoneNumber ? undefined : next.phoneNumber  ,
      name:prev.name==next.name ? undefined : next.name,
      surName:prev.surName==next.surName ? undefined : next.surName,
    };

    for (let [key, value] of Object.entries(userDto)) {
      if(value){return userDto;}
    }
    return undefined;
  }
  updateDataTEST(accountDataForm: FormGroup){
    return this.currentUser$.pipe(
      take(1),
      map(user=>{
        if (!user) {throw new Error("Użytkownik jest pusty")}
        let oldUserDto:IUserDto ={
          email:user?.email ?? undefined,
          phoneNumber:user?.phoneNumber ?? undefined,
          name:user?.name ?? undefined,
          surName:user?.surName ?? undefined,
        }
        var newValues = accountDataForm.value;
        let newUserDto:IUserDto ={
          email:newValues.email ?? undefined,
          phoneNumber:newValues.phoneNumber ?? undefined,
          name:newValues.name ?? undefined,
          surName:newValues.surName ?? undefined,
        };
        var checkedUser=this.findDifferencesIUsersDto(oldUserDto,newUserDto);
        if (!checkedUser) {throw new Error("no changes")}
        return checkedUser;
      }
      ),
      mergeMap(checkedUser=>{return this.updateUserData(checkedUser)})
      )
  }
}
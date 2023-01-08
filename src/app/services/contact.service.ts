import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IContactMessage } from '../models/IContactMessage';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  sendContactMessage(contactMessage:IContactMessage){
    return this.http.post<any>(this.baseUrl + 'contact',contactMessage);
  }
}

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, concatWith, Observable, throwError } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';
import { GeneralStateService } from '../services/general-state.service';

@Injectable()
export class ErrorHandlingInterceptor implements HttpInterceptor {

  constructor(private router: Router,private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(httpErrorResponse => {
        console.error(httpErrorResponse);
        if (httpErrorResponse instanceof HttpErrorResponse) {
          
          if (httpErrorResponse.status === 400) {
            this.toastr.error(httpErrorResponse.error?.Message)
          }
          if (httpErrorResponse.status === 401) {
            this.toastr.error('401 Unauthorized')
          }
          if (httpErrorResponse.status === 404) {
            this.toastr.error(httpErrorResponse.error?.Message);
          }
          if (httpErrorResponse.status === 500) {
            this.toastr.error(httpErrorResponse.error?.Message);
          }
        }
        return throwError(httpErrorResponse);
      })
    )
  }
}

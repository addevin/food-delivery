import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthHeaderInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(localStorage.getItem('actoken')){ 
      req = req.clone({
        headers: new HttpHeaders({
          Authorization: 'Bearer '+localStorage.getItem('actoken')
        })
      });
    }
    return next.handle(req);
  }
}

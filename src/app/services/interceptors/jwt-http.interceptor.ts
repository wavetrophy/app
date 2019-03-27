import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable()
/**
 * Class JwtHttpInterceptor
 */
export class JwtHttpInterceptor implements HttpInterceptor {
  /**
   * Constructor
   * @param {Storage} storage
   */
  constructor(private storage: Storage) {
  }

  /**
   * Custom JWT interceptor
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @returns {<HttpEvent<any>>}
   *
   * @see https://github.com/auth0/angular2-jwt/issues/504#issuecomment-375379149
   * @see https://stackoverflow.com/questions/45978813/use-a-promise-in-angular-httpclient-interceptor
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.storage.get('token_access'))
      .pipe(
        switchMap(token => {
          let clone: HttpRequest<any>;
          if (token) {
            clone = request.clone({
              setHeaders: {
                Accept: `application/json`,
                'Content-Type': `application/json`,
                Authorization: `Bearer ${token}`,
              },
            });
          } else {
            clone = request.clone({
              setHeaders: {
                Accept: `application/json`,
                'Content-Type': `application/json`,
              },
            });
          }
          return next.handle(clone);
        }),
      );

  }
}

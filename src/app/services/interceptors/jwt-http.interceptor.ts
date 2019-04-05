import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
/**
 * Class JwtHttpInterceptor
 */
export class JwtHttpInterceptor implements HttpInterceptor {
  /**
   * Constructor
   * @param {Storage} storage
   * @param {AuthService} auth
   */
  constructor(private storage: Storage, private auth: AuthService) {
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
    return this.addToken(request)
      .pipe(
        switchMap(clone => this.handleClone(next, clone)),
      );
  }

  /**
   * Add a token to the request
   * @param request
   * @returns {Observable<HttpRequest<any>>}
   */
  private addToken(request) {
    return from(this.storage.get('token_access').then(token => this.clone(request, token)));
  }

  /**
   * Handle the cloned request.
   * @param next
   * @param request
   * @returns {Observable<HttpSentEvent | HttpHeaderResponse | HttpResponse<any> | HttpProgressEvent | HttpUserEvent<any> | any>}
   */
  private handleClone(next, request) {
    return next.handle(request).pipe(
      catchError(e => this.handleError(e, next, request)),
    );
  }

  /**
   * Handle an error
   * @param e
   * @param next
   * @param originalRequest
   * @returns {any}
   */
  private handleError(e, next, originalRequest) {
    if (e instanceof HttpErrorResponse && e.status === 401) {
      return this.refreshToken().pipe(_ => {
        // To recursively handle the error (if an unauthorized occurs) replace next.handle with this.handleClone (NOT RECOMMENDED)
        return this.addToken(originalRequest).pipe(switchMap(clone => next.handle(clone)));
      });
    }

    return throwError(e);
  }

  /**
   * Refresh the token
   * @returns {Observable<Observable<any>>}
   */
  private refreshToken() {
    return from(this.storage.get('token_refresh').then(refreshToken => this.auth.refresh(refreshToken)));
  }

  /**
   * Clone a request.
   * @param request
   * @param token
   * @returns {HttpRequest<any>}
   */
  private clone(request, token) {
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
    return clone;
  }
}

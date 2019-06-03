import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { from, throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { ConsoleLogger } from '../logger/logger';

const logger = new ConsoleLogger('JWT');

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
  constructor(
    private storage: Storage,
    private auth: AuthService,
  ) {
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
    if (request.url.includes('login')) {
      logger.log('ignored');
      return next.handle(request);
    }
    logger.log('adding token');
    return this.addToken(request)
      .pipe(
        concatMap(clone => this.handleClone(next, clone)),
      );
  }

  /**
   * Add a token to the request
   * @param request
   * @returns {Observable<HttpRequest<any>>}
   */
  private addToken(request) {
    return from(this.storage.get(environment.storage.TOKEN_KEY).then(token => this.clone(request, token)));
  }

  /**
   * Handle the cloned request.
   * @param next
   * @param request
   * @returns {Observable<HttpSentEvent | HttpHeaderResponse | HttpResponse<any> | HttpProgressEvent | HttpUserEvent<any> | any>}
   */
  private handleClone(next, request) {
    logger.log('Handling clone', request.url.toString());
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
    logger.log('request errored', originalRequest.url.toString());
    if (e instanceof HttpErrorResponse && e.status === 401) {
      // Only handle if user is authenticated. This is to prevent the login screen from flashing dozends of invalid credentials error
      if (this.auth.isAuthenticated() === true) {
        if (originalRequest.url.includes('refresh')) {
          this.auth.logout();
          return throwError('Authentication not possible');
        }

        logger.log('refreshing auth data');
        return this.refreshToken().pipe(
          concatMap(_ => {
            logger.log('refreshed');
            // To recursively handle the error (if an unauthorized occurs) replace next.handle with this.handleClone (NOT RECOMMENDED)
            return this.addToken(originalRequest).pipe(concatMap(clone => {
                logger.log('handling clone', clone.url.toString());
                return next.handle(clone);
              }),
            );
          }),
          catchError(error => {
            if (error.status === 401) {
              this.auth.logout();
            }
            // TODO log error
            return throwError(error);
          }),
        );
      }
    }

    return throwError(e);
  }

  /**
   * Refresh the token
   * @returns {Observable<Observable<any>>}
   */
  private refreshToken() {
    return from(this.storage.get(environment.storage.TOKEN_REFRESH_KEY).then(refreshToken => {
      return this.auth.refresh(refreshToken).toPromise();
    }));
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

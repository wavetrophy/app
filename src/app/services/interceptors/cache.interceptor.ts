import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { NetworkService, NetworkStatus } from '../network/network.service';
import { CacheService } from '../network/cache.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ConsoleColor, ConsoleLogger } from '../logger/logger';
import { environment } from '../../../environments/environment';
import * as color from 'ansicolor';

const logger = new ConsoleLogger('CACHE', ConsoleColor.CYAN);

/**
 * CacheInterceptor
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private readonly isDebug: boolean;

  /**
   * Constructor
   * @param {NetworkService} network
   * @param {CacheService} cache
   */
  public constructor(
    private network: NetworkService,
    private cache: CacheService,
  ) {
    this.isDebug = !environment.production;
  }

  /**
   * Intercept
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @return {Observable<HttpEvent<any>>}
   */
  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ignore if method is not GET or OPTIONS
    if (request.method.toUpperCase() !== 'GET' && request.method.toUpperCase() !== 'OPTIONS') {
      return this.continue(request, next);
    }

    if (this.network.currentNetworkStatus() === NetworkStatus.ONLINE) {
      const responseSubject = new BehaviorSubject<HttpEvent<any>>(null);

      this.handleCache(request, responseSubject);
      this.handleNetwork(next, request, responseSubject);

      return responseSubject.asObservable();
    }

    this.info(color.lightYellow(`offline`), `[${request.method.toString().toUpperCase()}] ${request.url}`);

    return this.cache.getResponseFromCache(request).pipe(
      map((response: any) => {
        this.info(color.blue(`cache`), `[${request.method.toString().toUpperCase()}] ${request.url}`, JSON.stringify(response));

        return this.parse(request, response);
      }),
    );
  }

  /**
   * Handle a request over the network
   * @param {HttpHandler} next
   * @param {HttpRequest<any>} request
   * @param responseSubject
   */
  private handleNetwork(next: HttpHandler, request: HttpRequest<any>, responseSubject) {
    next.handle(request).subscribe(response => {
      // only cache successful responses
      if (response instanceof HttpResponse && response.status === 200) {
        this.info(color.green(`server`), `[${request.method.toString().toUpperCase()}] ${request.url}`);

        responseSubject.next(response);
        this.cache.cacheRequest(request, response);
        responseSubject.complete();
      }
    });
  }

  /**
   * Handle a request over the cache
   * @param {HttpRequest<any>} request
   * @param responseSubject
   */
  private handleCache(request: HttpRequest<any>, responseSubject) {
    // Query cache for response
    this.cache.isCached(request).then(isCached => {
      if (!isCached) {
        this.info(color.red('not cached'), `[${request.method.toString().toUpperCase()}] ${request.url}`);
        return;
      }

      this.cache.getResponseFromCache(request).subscribe(res => {
        const response = this.parse(request, res);

        responseSubject.next(response);
      });
    });
  }

  /**
   * Parse a response
   * @param {HttpRequest<any>} request
   * @param res
   * @return {HttpResponse<any>}
   */
  private parse(request: HttpRequest<any>, res: any): HttpResponse<any> {
    if (!(res instanceof HttpResponse)) {
      this.info(color.red(`empty`), `[${request.method.toString().toUpperCase()}] ${request.url}`);

      return new HttpResponse();
    }

    return res;
  }

  /**
   * Continue request without anything.
   * @param {HttpRequest<any>} request
   * @param {HttpHandler} next
   * @return {Observable<HttpEvent<any>>}
   */
  private continue(request: HttpRequest<any>, next: HttpHandler) {
    this.info(color.yellow(`non-cacheable`), `[${request.method.toString().toUpperCase()}] ${request.url}`);

    return next.handle(request);
  }

  /**
   * Log a message
   * @param messages
   */
  private info(...messages: any[]) {
    if (this.isDebug) {
      logger.info(...messages);
    }
  }
}

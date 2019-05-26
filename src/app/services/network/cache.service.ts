import { Injectable } from '@angular/core';
import { NetworkService } from './network.service';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { empty } from '../functions';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConsoleColor, ConsoleLogger } from '../logger/logger';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  /**
   * Constructor
   * @param {NetworkService} network
   * @param {Storage} storage
   */
  constructor(
    private network: NetworkService,
    private storage: Storage,
  ) {
  }

  /**
   * Cache a request
   * @param {HttpRequest<any>} request
   * @param {HttpResponse<any>} response
   */
  public cacheRequest(request: HttpRequest<any>, response: HttpResponse<any>) {
    const cacheKey = request.method + '-' + request.urlWithParams;
    this.storage.set(cacheKey, JSON.stringify(response));
  }

  /**
   * Check if a response is cached
   * @param {HttpRequest<any>} request
   * @return {Promise<boolean>}
   */
  public async isCached(request: HttpRequest<any>): Promise<boolean> {
    const cacheKey = request.method + '-' + request.urlWithParams;
    const data = await this.storage.get(cacheKey);
    return !empty(data);
  }

  /**
   * Check if a cached response is expired
   * @param {HttpRequest<any>} request
   * @return {Promise<boolean>}
   */
  public async isExpired(request: HttpRequest<any>): Promise<boolean> {
    return new Promise<boolean>(() => true);
  }

  /**
   * Clear the cache.
   * @return {Promise<void>}
   */
  public async clear() {
    const k = await this.storage.keys();
    const promises: Promise<any>[] = [];
    k.forEach((key) => {
      // Other requests than GET and OPTIONS aren't cached
      if (key.toString().startsWith('GET') || key.toString().startsWith('OPTIONS')) {
        promises.push(this.storage.remove(key));
      }
    });
    await Promise.all(promises);
  }

  /**
   * Get a response from the cache.
   * @param {HttpRequest<any>} request
   * @return {Observable<HttpResponse<any> | null>}
   */
  public getResponseFromCache(request: HttpRequest<any>): Observable<HttpResponse<any> | null> {
    const cacheKey = request.method + '-' + request.urlWithParams;
    return from(this.storage.get(cacheKey)).pipe(
      map((cached?: string) => {
        if (empty(cached)) {
          return null;
        }
        const response = JSON.parse(cached);
        return new HttpResponse(response);
      }),
    );
  }
}

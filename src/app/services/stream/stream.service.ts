import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
/**
 * Class StreamService
 */
export class StreamService {
  private readonly url: string;

  /**
   * StreamService constructor
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) {
    this.url = environment.api.url + '/api';
  }

  /**
   * Get the stream of a user.
   * @param {number} userId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @returns {Observable<Object>}
   */
  public getByUser(userId: number, forceReload: boolean = false) {
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get(`${this.url}/users/${userId}/stream`, {headers: headers});
  }

  /**
   * Get the stream of a wave
   * @param {number} waveId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @return {Observable<Object>}
   */
  public getByWave(waveId: number, forceReload: boolean = false) {
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get(`${this.url}/waves/${waveId}/stream`, {headers: headers});
  }

  /**
   * Get a single event of the stream
   * @param {number} userId
   * @param {number} eventId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @return {Observable<Object>}
   */
  public getEventByUser(userId: number, eventId: number, forceReload: boolean = false) {
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get(`${this.url}/users/${userId}/events/${eventId}`, {headers: headers});
  }

  /**
   * Get hotels by user
   * @param {number} userId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @return {Observable<Object>}
   */
  public getHotelsByUser(userId: number, forceReload: boolean = false) {
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get(`${this.url}/users/${userId}/hotels`, {headers: headers});
  }

  /**
   * Get hotel by user
   * @param {number} userId
   * @param {number} hotelId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @return {Observable<Object>}
   */
  public getHotelByUser(userId: number, hotelId: number, forceReload: boolean = false) {
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get(`${this.url}/users/${userId}/hotels/${hotelId}`, {headers: headers});
  }
}

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
   * @returns {Observable<Object>}
   */
  public getByUser(userId: number) {
    return this.http.get(`${this.url}/users/${userId}/stream`);
  }

  /**
   * Get a single location of the stream
   * @param {number} userId
   * @param {number} locationId
   * @return {Observable<Object>}
   */
  public getLocationByUser(userId: number, locationId: number) {
    return this.http.get(`${this.url}/users/${userId}/stream/${locationId}`);
  }
}

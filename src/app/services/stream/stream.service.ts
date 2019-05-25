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
   * Get the stream of a wave
   * @param {number} waveId
   * @return {Observable<Object>}
   */
  public getByWave(waveId: number) {
    return this.http.get(`${this.url}/waves/${waveId}/stream`);
  }

  /**
   * Get a single event of the stream
   * @param {number} userId
   * @param {number} eventId
   * @return {Observable<Object>}
   */
  public getEventByUser(userId: number, eventId: number) {
    return this.http.get(`${this.url}/users/${userId}/events/${eventId}`);
  }

  /**
   * Get hotels by user
   * @param {number} userId
   * @return {Observable<Object>}
   */
  public getHotelsByUser(userId: number) {
    return this.http.get(`${this.url}/users/${userId}/hotels`);
  }

  /**
   * Get hotel by user
   * @param {number} userId
   * @param {number} hotelId
   * @return {Observable<Object>}
   */
  public getHotelByUser(userId: number, hotelId: number) {
    return this.http.get(`${this.url}/users/${userId}/hotels/${hotelId}`);
  }
}

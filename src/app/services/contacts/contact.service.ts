import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly url: string;

  /**
   * ContactService constructor
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) {
    this.url = environment.api.url + '/api';
  }

  /**
   * Get contacts of a wave
   * @param waveId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @returns {Observable<Object>}
   */
  public getContacts(waveId, forceReload: boolean = false): Observable<Object> {
    const url = `${this.url}/waves/${waveId}/contacts`;
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }
    return this.http.get(url, {headers: headers});
  }

  /**
   * Get a single contact.
   * @param waveId
   * @param contactId
   * @param {boolean} forceReload
   * @return {Observable<Object>}
   */
  public getContact(waveId, contactId, forceReload: boolean = false) {
    const url = `${this.url}/waves/${waveId}/contacts/${contactId}`;
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }
    return this.http.get(url, {headers: headers});
  }
}

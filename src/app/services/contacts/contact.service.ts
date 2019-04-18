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
   * @returns {Observable<Object>}
   */
  public getContacts(waveId): Observable<Object> {
    const url = `${this.url}/waves/${waveId}/contacts`;
    return this.http.get(url);
  }
}

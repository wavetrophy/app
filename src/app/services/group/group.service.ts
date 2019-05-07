import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Wave } from '../wave/types/wave';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private readonly url: string;

  /**
   * Constructor
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) {
    this.url = environment.api.url + '/api';
  }

  /**
   * Get all groups of a wave
   * @param {Wave} wave
   * @return {Observable<Object>}
   */
  public getGroups(wave: Wave) {
    const url = `${this.url}/waves/${wave.id}/groups`;
    return this.http.get(url);
  }
}

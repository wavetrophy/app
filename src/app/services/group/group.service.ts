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
   * Get a single group.
   * @param {number} groupId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @return {Observable<Object>}
   */
  public getGroup(groupId: number, forceReload: boolean = false) {
    const url = `${this.url}/groups/${groupId}`;

    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }
    return this.http.get(url, {headers: headers});
  }

  /**
   * Get all groups of a wave
   * @param {Wave} wave
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @return {Observable<Object>}
   */
  public getGroups(wave: Wave, forceReload: boolean = false) {
    const url = `${this.url}/waves/${wave.id}/groups`;

    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }
    return this.http.get(url, {headers: headers});
  }
}

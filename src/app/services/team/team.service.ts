import { Injectable } from '@angular/core';
import { Wave } from '../wave/types/wave';
import { Group } from '../contacts/interfaces';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private readonly url: string;

  /**
   * Constructor.
   * @param {HttpClient} http
   */
  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.api.url + '/api';
  }

  /**
   * Get a single team
   * @param teamId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @return {Observable<Object>}
   */
  public getTeam(teamId, forceReload: boolean = false) {
    const url = `${this.url}/teams/${teamId}`;
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get(url, {headers: headers});
  }

  /**
   * Get all teams
   * @param {Wave} wave
   * @param {Group} group
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @return {Observable<Object>}
   */
  public getTeams(wave: Wave, group: Group, forceReload: boolean = false) {
    const url = `${this.url}/waves/${wave.id}/groups/${group.id}/teams`;
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get(url, {headers: headers});
  }
}

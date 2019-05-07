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
   * @return {Observable<Object>}
   */
  public getTeam(teamId) {
    const url = `${this.url}/teams/${teamId}`;
    return this.http.get(url);
  }

  /**
   * Get all teams
   * @param {Wave} wave
   * @param {Group} group
   * @return {Observable<Object>}
   */
  public getTeams(wave: Wave, group: Group) {
    const url = `${this.url}/waves/${wave.id}/groups/${group.id}/teams`;
    return this.http.get(url);
  }
}

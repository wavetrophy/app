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

  constructor(
    private http: HttpClient,
  ) {
    this.url = environment.api.url + '/api';
  }

  public getTeams(wave: Wave, group: Group) {
    const url = `${this.url}/waves/${wave.id}/groups/${group.id}/teams`;
    return this.http.get(url);
  }
}

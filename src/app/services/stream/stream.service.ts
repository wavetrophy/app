import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StreamService {
  private readonly url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api.url + '/api';
  }

  public getLocationsByWave(waveId: number) {
    return this.http.get(`${this.url}/waves/${waveId}/locations`);
  }
}

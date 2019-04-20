import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WaveService {
  private readonly url: string;

  constructor(private http: HttpClient, private auth: AuthService) {
    this.url = environment.api.url + '/api';
  }

  public getCurrentWaveData(waveId) {
    const url = `${this.url}/waves/${waveId}`;
    return this.http.get(url);
  }
}

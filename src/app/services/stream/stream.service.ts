import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private readonly url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api.url + '/api';
  }

  public getByUser(userId: number): Observable<Object> {
    return this.http.get(`${this.url}/users/${userId}/stream`);
  }
}

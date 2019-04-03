import { Injectable } from '@angular/core';
import { Email } from './types/email';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly url: string;

  constructor(private http: HttpClient) {
    this.url = environment.api.url + '/api';
  }

  getEmails(userId: number): Observable<Email[] | null> {
    const url = `${this.url}/users/${userId}/emails`;
    return this.http.get<Email[] | null>(url);
  }
}

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

  /**
   * Constructor
   * @param {HttpClient} http
   */
  constructor(private http: HttpClient) {
    this.url = environment.api.url + '/api';
  }

  /**
   * Get all emails.
   * @param {number} userId
   * @returns {Observable<Email[] | null>}
   */
  public getEmails(userId: number): Observable<Email[] | null> {
    const url = `${this.url}/users/${userId}/emails`;
    return this.http.get<Email[] | null>(url);
  }

  /**
   * Update an email.
   * @param {Email} email
   * @returns {Observable<Email>}
   */
  public updateEmail(email: Email): Observable<Email> {
    const url = `${this.url}/user-emails/${email.id}`;
    return this.http.put<Email>(url, email);
  }
}

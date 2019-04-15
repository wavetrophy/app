import { Injectable } from '@angular/core';
import { Email } from './types/email';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './types/user';

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
   * Create an email
   * @param {number} userId
   * @param {string} email
   * @param {boolean} isPublic
   * @returns {Observable<Email[] | any>}
   */
  public createEmail(userId: number, email: string, isPublic: boolean) {
    const url = `${this.url}/user-emails`;
    return this.http.post<Email[] | any>(url, {
      email: email,
      is_public: isPublic,
      user: `/api/users/${userId}`,
    });
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

  /**
   * Remove an email.
   * @param {Email} email
   * @returns {Observable<boolean>}
   */
  public removeEmail(email: Email): Observable<any> {
    const url = `${this.url}/user-emails/${email.id}`;
    return this.http.delete(url);
  }

  /**
   * Get a user.
   * @param {number} userId
   * @returns {Observable<User>}
   */
  public getUser(userId: number): Observable<User> {
    const url = `${this.url}/users/${userId}`;
    return this.http.get<User>(url);
  }

  /**
   * Update a user
   * @param {User} user
   * @returns {Observable<User>}
   */
  public updateUser(user: User) {
    const url = `${this.url}/users/${user.id}`;
    return this.http.put<User>(url, user);
  }
}

import { Injectable } from '@angular/core';
import { Email } from './types/email';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from './types/user';
import { Phonenumber } from './types/phonenumber';
import { Team } from './types/team';

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
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @returns {Observable<Email[] | null>}
   */
  public getEmails(userId: number, forceReload: boolean = false): Observable<Email[] | null> {
    const url = `${this.url}/users/${userId}/emails`;
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get<Email[] | null>(url, {headers: headers});
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
   * Get all phonenumbers
   * @param {number} userId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @returns {Observable<Phonenumber[] | null>}
   */
  public getPhonenumbers(userId: number, forceReload: boolean = false): Observable<Phonenumber[] | null> {
    const url = `${this.url}/users/${userId}/phonenumbers`;
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get<Phonenumber[] | null>(url, {headers: headers});
  }

  /**
   * Create an phonenumber
   * @param {number} userId
   * @param {string} countryCode
   * @param {string} phonenumber
   * @param {boolean} isPublic
   * @returns {Observable<Phonenumber[] | any>}
   */
  public createPhonenumber(userId: number, countryCode: string, phonenumber: string, isPublic: boolean) {
    const url = `${this.url}/user-phonenumbers`;
    return this.http.post<Phonenumber[] | any>(url, {
      phonenumber: phonenumber,
      country_code: countryCode,
      is_public: isPublic,
      user: `/api/users/${userId}`,
    });
  }

  /**
   * Update an phonenumber.
   * @param {Phonenumber} phonenumber
   * @returns {Observable<Phonenumber>}
   */
  public updatePhonenumber(phonenumber: Phonenumber): Observable<Phonenumber> {
    const url = `${this.url}/user-phonenumbers/${phonenumber.id}`;
    return this.http.put<Phonenumber>(url, phonenumber);
  }

  /**
   * Remove an phonenumber.
   * @param {Phonenumber} phonenumber
   * @returns {Observable<boolean>}
   */
  public removePhonenumber(phonenumber: Phonenumber): Observable<any> {
    const url = `${this.url}/user-phonenumbers/${phonenumber.id}`;
    return this.http.delete(url);
  }

  /**
   * Get a user.
   * @param {number} userId
   * @param {boolean} forceReload Indicates if the request should not be taken from the cache
   * @returns {Observable<User>}
   */
  public getUser(userId: number, forceReload: boolean = false): Observable<User> {
    const url = `${this.url}/users/${userId}`;
    const headers = {};
    if (forceReload) {
      headers['Force-Reload'] = 'true';
    }

    return this.http.get<User>(url, {headers: headers});
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

  /**
   * Update a password.
   * @param userId
   * @param {string} password
   * @return {Observable<User>}
   */
  public updatePassword(userId: string, password: string) {
    const url = `${this.url}/users/${userId}/password`;
    return this.http.put(url, {password: password});
  }

  /**
   * Join a team
   * @param {number} userId
   * @param {Team} team
   * @return {Observable<User>}
   */
  public joinTeam(userId: number, team: Team) {
    const url = `${this.url}/users/${userId}`;
    return this.http.put<User>(url, {team: `/api/teams/${team.id}`});
  }
}

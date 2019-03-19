import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertController, Platform } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'token_access';
const TOKEN_REFRESH_KEY = 'token_refresh';

@Injectable({
  providedIn: 'root',
})
/**
 * Class Authentication Service
 */
export class AuthService {
  private url = environment.api.url;
  private _user = null;
  private _authenticationState = new BehaviorSubject(false);

  /**
   * AuthenticationService constructor
   * @param {HttpClient} http The HTTP Client
   * @param {JwtHelperService} helper The JSON Web Token Helper
   * @param {Storage} storage The Storage
   * @param {Platform} plt The platform (ionic)
   * @param {AlertController} alertController The Alert Controller
   */
  public constructor(private http: HttpClient,
                     private helper: JwtHelperService,
                     private storage: Storage,
                     private plt: Platform,
                     private alertController: AlertController,
  ) {
    this.plt.ready()
      .then((): void => {
        this.checkToken();
      });
  }

  /**
   * Get the authentication state
   * @returns {BehaviorSubject<boolean>}
   */
  public get authenticationState() {
    return this._authenticationState;
  }

  /**
   * Get the user.
   * @returns {any}
   */
  public get user() {
    return this._user;
  }

  /**
   * Check the token.
   */
  public async checkToken() {
    const token = await this.storage.get(TOKEN_KEY);
    if (token) {
      const decoded = this.helper.decodeToken(token);
      const isExpired = this.helper.isTokenExpired(token);

      if (!isExpired) {
        this._user = decoded;
        this._authenticationState.next(true);
        return;
      }
    }
    const refreshToken = await this.storage.get(TOKEN_REFRESH_KEY);
    if (refreshToken) {
      this.refresh(refreshToken);
    }
  }

  /**
   * Log a user in.
   * @param {Object} credentials The credentials including the password and the email.
   * @returns {Observable<any>}
   */
  public login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.url}/auth/login`, credentials)
      .pipe(
        tap(res => {
          this.storage.set(TOKEN_KEY, res['token']);
          this.storage.set(TOKEN_REFRESH_KEY, res['refresh_token']);
          this._user = this.helper.decodeToken(res['token']);
          this._authenticationState.next(true);
        }),
        catchError(e => {
          this.showAlert(e.error.msg);
          throw new Error(e);
        }),
      );
  }

  /**
   * Refresh a JWT Token.
   * @param {string} refreshToken
   * @returns {Observable<any>}
   */
  public refresh(refreshToken: string) {
    return this.http.post(`${this.url}/auth/refresh`, {refresh_token: refreshToken})
      .pipe(
        tap(res => {
          this.storage.set(TOKEN_KEY, res['token']);
          this.storage.set(TOKEN_REFRESH_KEY, res['refresh_token']);
          this._user = this.helper.decodeToken(res['token']);
          this._authenticationState.next(true);
        }),
        catchError(e => {
          this.showAlert(e.error.msg);
          this._authenticationState.next(false);
          throw new Error(e);
        }),
      ).subscribe();
  }

  /**
   * Log out a user.
   */
  public logout(): void {
    this.storage.remove(TOKEN_KEY).then(() => {
      this._authenticationState.next(false);
    });
  }

  /**
   * Check if a user is authenticated.
   * @returns {boolean}
   */
  public isAuthenticated(): boolean {
    return this._authenticationState.value;
  }

  /**
   * Show an alert.
   * @param {string} msg The message to display
   */
  public showAlert(msg: string): void {
    this.alertController.create({
      message: msg,
      header: 'Error',
      buttons: ['OK'],
    }).then((alert) => {
      alert.present();
    });
  }
}

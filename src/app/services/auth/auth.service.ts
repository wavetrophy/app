import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertController, Platform } from '@ionic/angular';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { AuthData } from './types/authdata';
import { Router } from '@angular/router';
import { Firebase } from '@ionic-native/firebase/ngx';
import { e } from '../functions';
import { CacheService } from '../network/cache.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Class Authentication Service
 */
export class AuthService {
  private url = environment.api.url;
  private _authData: AuthData = null;
  private _authenticationState = new BehaviorSubject(false);
  private _dataRefresh: BehaviorSubject<AuthData | null> = new BehaviorSubject(null);

  /**
   * AuthenticationService constructor
   * @param {HttpClient} http The HTTP Client
   * @param {JwtHelperService} helper The JSON Web Token Helper
   * @param {Storage} storage The Storage
   * @param {Router} router
   * @param {Platform} plt The platform (ionic)
   * @param {AlertController} alertController The Alert Controller
   * @param {Firebase} firebase
   * @param {CacheService} cache
   */
  public constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private router: Router,
    private plt: Platform,
    private alertController: AlertController,
    private firebase: Firebase,
    private cache: CacheService,
  ) {
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
  public get data(): AuthData {
    return this._authData;
  }

  /**
   *
   * @return {BehaviorSubject<AuthData>}
   */
  public onDataRefresh(): BehaviorSubject<AuthData> {
    return this._dataRefresh;
  }

  /**
   * Check the token.
   */
  public async checkToken(): Promise<boolean> {
    const token = await this.storage.get(environment.storage.TOKEN_KEY);
    if (token) {
      const decoded = <AuthData>this.helper.decodeToken(token);
      const isExpired = this.helper.isTokenExpired(token);

      if (!isExpired) {
        this._authData = decoded;
        this._authenticationState.next(true);
        return this._authenticationState.value;
      }
    }
    const refreshToken = await this.storage.get(environment.storage.TOKEN_REFRESH_KEY);
    if (!!refreshToken) {
      return !!(await this.refresh(refreshToken).toPromise());
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
          if (e(res, 'token') && e(res, 'refresh_token')) {
            this.storage.set(environment.storage.TOKEN_KEY, res['token']);
            this.storage.set(environment.storage.TOKEN_REFRESH_KEY, res['refresh_token']);
            this._authData = <AuthData>this.helper.decodeToken(res['token']);
            this._authenticationState.next(true);
          }
        }),
        catchError(e => {
          this.showAlert('Falsche Zugangsdaten');
          throw new Error(e);
        }),
      );
  }

  /**
   * Refresh a JWT Token.
   * @returns {Observable<any>}
   */
  public refresh(refreshToken: string): Observable<any> {
    return this.http.post(`${this.url}/auth/refresh`, {refresh_token: refreshToken})
      .pipe(
        concatMap(res => {
          return from(this.storage.set(environment.storage.TOKEN_KEY, res['token'])
            .then(() => this.storage.set(environment.storage.TOKEN_REFRESH_KEY, res['refresh_token']))
            .then(() => {
              this._authData = <AuthData>this.helper.decodeToken(res['token']);
              // Because its set to anonymous if the user is not logged in
              this.firebase.setUserId(this._authData.user_id.toString());
              this._authenticationState.next(true);
              this._dataRefresh.next(this.data);
            }),
          );
        }),
        catchError(e => {
          this.showAlert('Falsche Zugangsdaten');
          this._authenticationState.next(false);
          this._authenticationState.next(null);
          throw new Error(e);
        }),
      );
  }

  /**
   * Log out a user.
   */
  public async logout(): Promise<any> {
    this.cache.clear();
    await this.storage.remove(environment.storage.TOKEN_REFRESH_KEY);
    await this.storage.remove(environment.storage.TOKEN_KEY);
    this._authenticationState.next(false);
    this.router.navigate(['auth', 'login']);
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
    this.alertController.getTop()
      .then((alert) => {
        alert.dismiss();

        return this.alertController.create({
          message: msg,
          header: 'Fehler',
          buttons: ['OK'],
        });
      })
      .then((alert) => {
        alert.present();
      });
  }
}

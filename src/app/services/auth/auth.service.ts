import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertController, Platform } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
/**
 * Class Authentication Service
 */
export class AuthService {
  private url = environment.url;
  private user = null;
  private authenticationState = new BehaviorSubject(false);

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
   * Check the token.
   */
  public checkToken(): void {
    this.storage.get(TOKEN_KEY)
        .then(token => {
          if (token) {
            const decoded = this.helper.decodeToken(token);
            const isExpired = this.helper.isTokenExpired(token);

            if (!isExpired) {
              this.user = decoded;
              this.authenticationState.next(true);
            } else {
              this.storage.remove(TOKEN_KEY);
            }
          }
        });
  }

  /**
   * Log a user in.
   * @param {Object} credentials The credentials including the password and the email.
   * @returns {Observable<any>}
   */
  public login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.url}/api/login`, credentials)
        .pipe(
            tap(res => {
              this.storage.set(TOKEN_KEY, res['token']);
              this.user = this.helper.decodeToken(res['token']);
              this.authenticationState.next(true);
            }),
            catchError(e => {
              this.showAlert(e.error.msg);
              throw new Error(e);
            }),
        );
  }

  /**
   * Log out a user.
   */
  public logout(): void {
    this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });
  }

  /**
   * Check if a user is authenticated.
   * @returns {boolean}
   */
  public isAuthenticated(): boolean {
    return this.authenticationState.value;
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

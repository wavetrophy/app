import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { PushNotificationService } from './services/firebase/cloud-messaging/push-notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
/**
 * Class AppComponent
 */
export class AppComponent implements OnInit, OnDestroy {
  /**
   * Subscription array
   * @type {any[]}
   */
  private subs: Subscription[] = [];

  /**
   * AppComponent constructor.
   * @param {Platform} platform The platform
   * @param {SplashScreen} splashScreen The splash screen
   * @param {StatusBar} statusBar The status bar
   * @param {AuthService} authService The auth service
   * @param {Router} router The router
   */
  public constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private pushNotifications: PushNotificationService,
  ) {
    this.initializeApp();
  }

  /**
   * Initialize the application.
   */
  public initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.setupNotifications();
    });
  }

  /**
   * On init hook
   * @returns {Promise<void>}
   */
  public async ngOnInit() {
    await this.authService.checkToken();
    const state = this.authService.authenticationState.getValue();

    if (state === true) {
      this.router.navigate(['wave']);
    } else {
      this.router.navigate(['auth', 'login']);
    }
  }

  /**
   * On destroy hook.
   */
  public ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Setup notification listening
   */
  public setupNotifications() {
    this.pushNotifications.getToken();
    const sub = this.pushNotifications.onNotification().subscribe(notification => {
      let message = '';
      if (this.platform.is('ios')) {
        message = notification.aps.alert;
      } else {
        message = notification.body;
      }
      // TODO handle message
    });
    this.subs.push(sub);
  }
}

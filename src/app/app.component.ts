import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
/**
 * Class AppComponent
 */
export class AppComponent implements OnInit {
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
  ) {
    this.initializeApp();
  }

  /**
   * Initialize the application.
   */
  public initializeApp() {
    moment.locale('de');
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  public async ngOnInit() {
    await this.authService.checkToken();
    const state = this.authService.authenticationState.getValue();

    if (state === true) {
      moment.locale(this.authService.data.locale.short);
      this.router.navigate(['wave']);
    } else {
      this.router.navigate(['auth', 'login']);
    }
  }
}

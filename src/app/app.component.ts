import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from './services/firebase/cloud-messaging/notification.service';
import { NetworkService } from './services/network/network.service';
import { NetworkStatus } from './services/network/network-status';
import { ImageCacheConfig } from './services/image-cache';
import { PasswordChangePage } from './modal/user/password-change/password-change.page';
import { __ } from './services/functions';
import * as moment from 'moment-timezone';
import 'moment/locale/de-ch';
import 'moment/locale/en-gb';
import { Pro } from '@ionic/pro';

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
   * @param {NotificationService} notifications
   * @param {NetworkService} network
   * @param {ToastController} toast
   * @param {ImageCacheConfig} imageCacheConfig
   * @param modal
   * @param alert
   * @param nav
   */
  public constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private router: Router,
    private notifications: NotificationService,
    private network: NetworkService,
    private toast: ToastController,
    private imageCacheConfig: ImageCacheConfig,
    private modal: ModalController,
    private alert: AlertController,
    private nav: NavController,
  ) {
    this.initializeApp();
  }

  /**
   * Initialize the application.
   */
  public initializeApp() {
    this.imageCacheConfig.setFallbackUrl('assets/logo.jpg');
    this.imageCacheConfig.useImg = true;
    this.platform.ready().then(() => {
      // moment.locale(this.authService.data.locale.short);
      moment.locale('de-CH');
      // This is to set all dates per default to -01:00, so the dates from the server will be displayed correctly (+01:00)
      moment.tz.setDefault('Atlantic/Azores');
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /**
   * On init hook
   * @returns {Promise<void>}
   */
  public async ngOnInit() {
    let state = true;
    if (this.network.currentNetworkStatus() === NetworkStatus.ONLINE) {
      await this.authService.checkToken();
      state = this.authService.authenticationState.getValue();
    } else {
      const sub = this.network.onNetworkChange().subscribe((status: NetworkStatus) => {
        if (status === NetworkStatus.ONLINE) {
          this.authService.checkToken();
          sub.unsubscribe();
        }
      });
      this.subs.push(sub);
      state = this.authService.authenticationState.getValue();
    }
    Pro.init('b87b16f8', {
      'channel': 'Master',
    });

    if (state === true) {
      // Dont setup notifications if the user is not logged in.
      this.notifications.register();
      // moment.locale(this.authService.data.locale.short);
      moment.locale('de-CH');
      // This is to set all dates per default to -01:00, so the dates from the server will be displayed correctly (+01:00)
      moment.tz.setDefault('Atlantic/Azores');
      this.nav.navigateRoot(['/', 'wave']);
    } else {
      this.nav.navigateRoot(['/', 'auth', 'login']);
    }

    const subAuth = this.authService.authenticationState.subscribe(() => this.handleDataRefresh());
    const subNet = this.network.onNetworkChange().subscribe(() => this.handleNetworkChange());
    this.subs.push(subAuth);
    this.subs.push(subNet);
  }

  /**
   * On destroy hook.
   */
  public ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.notifications.unregister();
  }

  /**
   * Check reset password
   */
  public async handleDataRefresh() {
    if (!this.authService.isAuthenticated()) {
      return;
    }
    if (!('data' in this.authService) && !this.authService['data']) {
      return;
    }
    const data = this.authService.data;
    if ('must_reset_password' in data && data.must_reset_password) {
      const alert = await this.alert.create({
        header: __('Passwort ändern'),
        message: __('Bitte ändere Dein Passwort'),
        buttons: [
          {
            text: 'OK',
            handler: async () => {
              alert.dismiss();
              PasswordChangePage.asModal(this.modal, this.authService.data.user_id.toString());
            },
          },
          {
            text: __('Später (nicht empfohlen)'),
            role: 'cancel',
          },
        ],
      });
      alert.present();
    }
  }

  /**
   * Handle network change
   * @return {Promise<void>}
   */
  public async handleNetworkChange() {
    let config;
    if (this.network.currentNetworkStatus() === NetworkStatus.OFFLINE) {
      config = {
        message: __('Du bist offline. App funktioniert nur beschränkt'),
        duration: 10000,
        buttons: [{
          text: __('OK'),
          role: 'cancel',
        }],
      };
    } else {
      config = {
        message: __('Du bist wieder online'),
        duration: 3000,
        buttons: [{
          text: __('OK'),
          role: 'cancel',
        }],
      };
    }
    const toast = await this.toast.create(config);
    toast.present();
  }
}

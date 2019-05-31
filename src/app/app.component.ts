import { Component, OnDestroy, OnInit } from '@angular/core';

import { AlertController, ModalController, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService } from './services/firebase/cloud-messaging/notification.service';
import * as moment from 'moment';
import { NetworkService } from './services/network/network.service';
import { NetworkStatus } from './services/network/network-status';
import { ImageCacheConfig } from './services/image-cache';
import { PasswordChangePage } from './modal/user/password-change/password-change.page';

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
  ) {
    this.initializeApp();
  }

  /**
   * Initialize the application.
   */
  public initializeApp() {
    moment.locale('de');
    this.imageCacheConfig.setFallbackUrl('assets/logo.png');
    this.imageCacheConfig.useImg = true;
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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
      // Dont setup notifications if the user is not logged in.
      this.notifications.register();
      moment.locale(this.authService.data.locale.short);
      this.router.navigate(['wave']);
    } else {
      this.router.navigate(['auth', 'login']);
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
    if (!('data' in this.authService)) {
      return;
    }
    const data = this.authService.data;
    if ('must_reset_password' in data && data.must_reset_password) {
      const alert = await this.alert.create({
        header: 'Change password',
        message: 'Please change your password',
        buttons: [
          {
            text: 'OK',
            handler: async () => {
              alert.dismiss();
              PasswordChangePage.asModal(this.modal, this.authService.data.user_id.toString());
            },
          },
          {
            text: 'Later (not recommended)',
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
        message: 'You\'re offline, some functionality is not available',
        duration: 10000,
        buttons: [{
          text: 'Okay',
          role: 'cancel',
        }],
      };
    } else {
      config = {
        message: 'You\'re back online',
        duration: 3000,
        buttons: [{
          text: 'Okay',
          role: 'cancel',
        }],
      };
    }
    const toast = await this.toast.create(config);
    toast.present();
  }
}

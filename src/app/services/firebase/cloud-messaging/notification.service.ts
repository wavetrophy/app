import { Injectable, NgZone } from '@angular/core';
import { PushNotificationService } from './push-notification.service';
import { NavController, Platform } from '@ionic/angular';
import { LocalNotificationService } from './local-notification.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ILocalNotification } from '@ionic-native/local-notifications';
import { Router } from '@angular/router';
import { ConsoleLogger } from '../../logger/logger';

const logger = new ConsoleLogger('PUSH');

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public static TOPIC_GENERAL = 'general';

  private registered = false;
  private sub: Subscription = null;

  public static TOPIC_GROUP = (groupId: number) => `group-${groupId}`;
  public static TOPIC_QUESTION = (questionId: number) => `question-${questionId}`;
  public static TOPIC_WAVE = (waveId: number) => `wave-${waveId}`;

  /**
   * Notification service constructor
   * @param {LocalNotificationService} notification
   * @param {PushNotificationService} push
   * @param {Platform} platform
   * @param {AuthService} auth
   * @param {Router} router
   * @param {NavController} nav
   * @param {NgZone} ng
   */
  constructor(
    private notification: LocalNotificationService,
    private push: PushNotificationService,
    private platform: Platform,
    private auth: AuthService,
    private router: Router,
    private nav: NavController,
    private ng: NgZone,
  ) {
  }

  /**
   * Register notification service
   */
  public register() {
    logger.log('registering');
    if (this.registered) {
      logger.log('cancelled');
      return;
    }
    this.registered = true;
    this.push.getToken();

    this.push.subscribeTo(NotificationService.TOPIC_GENERAL);
    this.push.subscribeTo(NotificationService.TOPIC_WAVE(this.auth.data.current_wave.id));
    this.push.subscribeTo(NotificationService.TOPIC_GROUP(this.auth.data.group_id));

    this.registerHandlers();

    this.sub = this.push.onNotification().subscribe(notification => {
      let message = '';
      let title = 'WAVETROPHY';
      if (this.platform.is('ios')) {
        message = notification.aps.alert;
        logger.log('[iOS] notification received', notification);
      } else {
        logger.log('[ANDROID] notification received', notification);
        message = notification.body;
        title = notification.title;
      }

      const data = JSON.parse(notification.json) || {};
      this.notification.info(title, message, data);
    });
    logger.log('registered');
  }

  private registerHandlers() {
    this.notification.on('click').subscribe((notification: ILocalNotification) => {
      logger.log('notification clicked', event);
      this.platform.ready().then(() => {
        if (notification.data) {
          if ('open' in notification.data) {
            this.ng.run(() => this.nav.navigateRoot(['/']))
              .then(() => this.nav.navigateRoot(notification.data.open));
          }
        }
      });
    });
    this.notification.on('clear').subscribe((event) => {
      logger.log('notification cleared', event);
    });
    this.notification.on('cancel').subscribe((event) => {
      logger.log('notification cancelled', event);
    });
    this.notification.on('update').subscribe((event) => {
      logger.log('notification updated', event);
    });
    this.notification.on('add').subscribe((event) => {
      logger.log('notification added', event);
    });
    this.notification.on('trigger').subscribe((event) => {
      logger.log('notifcitoin triggered', event);
    });
  }

  /**
   * Unregister notification service.
   */
  public unregister() {
    if (!this.registered) {
      return;
    }

    this.registered = false;
    this.sub.unsubscribe();
  }
}

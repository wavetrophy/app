import { Injectable } from '@angular/core';
import { PushNotificationService } from './push-notification.service';
import { Platform } from '@ionic/angular';
import { LocalNotificationService } from './local-notification.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private registered = false;
  private sub: Subscription = null;

  /**
   * Notification service constructor
   * @param {LocalNotificationService} notification
   * @param {PushNotificationService} push
   * @param {Platform} platform
   */
  constructor(
    private notification: LocalNotificationService,
    private push: PushNotificationService,
    private platform: Platform,
  ) {
  }

  /**
   * Register notification service
   */
  public register() {
    debugger;
    console.log('registering notifications');
    if (this.registered) {
      console.log('cancelled registration');
      return;
    }
    console.log('registering...');
    this.registered = true;
    this.push.getToken();
    console.log('registered. ');
    this.sub = this.push.onNotification().subscribe(notification => {
      console.log('[NOTIFICATION]', notification);
      let message = '';
      let title = 'WAVETROPHY';
      if (this.platform.is('ios')) {
        message = notification.aps.alert;
        console.log('[iOS] notification received', notification);
      } else {
        console.log('[ANDROID] notification received', notification);
        message = notification.body;
        title = notification.title;
      }
      this.notification.info(title, message);
    });
    console.log('registered. notifications');
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

import { Injectable } from '@angular/core';
import { PushNotificationService } from './push-notification.service';
import { Platform } from '@ionic/angular';
import { LocalNotificationService } from './local-notification.service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  public static TOPIC_GENERAL = 'general';

  private registered = false;
  private sub: Subscription = null;

  public static TOPIC_GROUP = (groupId: number) => `group-${groupId}`;
  public static TOPIC_QUESTION = (questionId: number) => `question-${questionId}`;

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
    console.log('registering notifications');
    if (this.registered) {
      console.log('cancelled registration');
      return;
    }
    console.log('registering...');
    this.registered = true;
    this.push.getToken();
    console.log('registered. ');
    this.push.subscribeTo(NotificationService.TOPIC_GENERAL);
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

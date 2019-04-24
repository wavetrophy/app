import { Injectable } from '@angular/core';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LocalNotification } from './types/local-notification';

@Injectable({
  providedIn: 'root',
})
export class LocalNotificationService {
  /**
   * LocalNotificationService
   * @param {LocalNotifications} notifications
   */
  constructor(
    private notifications: LocalNotifications,
  ) {
  }

  /**
   * Schedule a notification
   */
  public schedule(notification: LocalNotification) {
    // TODO add icons
    // TODO load defaults from a config
    const defaults: ILocalNotification = {
      // config
      sound: 'res://platform_default',
      led: '#3880ff', // primary
      vibrate: true,
      // defaults
      priority: 2, // reallly important
      icon: 'res://icon',
      smallIcon: 'res://ic_popup_reminder',
      launch: true,
      wakeup: true,
      autoClear: true,
    };

    const localNotification = Object.assign(defaults, notification);
    this.notifications.schedule(localNotification);
  }
}

import { Injectable } from '@angular/core';
import { ILocalNotification, LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { LocalNotification } from './types/local-notification';
import moment from 'moment-timezone';
import { Observable } from 'rxjs';

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
   * Info notification
   * @param {string} title
   * @param {string} message
   * @param data
   */
  public info(title: string, message: string, data: any) {
    const notification: LocalNotification = {
      title: title,
      text: message,
    };
    this.schedule(notification, data);
  }

  /**
   * Schedule a notification
   */
  public schedule(notification: LocalNotification, data: any) {
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
      data: data,
    };

    const localNotification = Object.assign(defaults, notification);

    // disable for now
    // if (data['scheduled']) {
    //   localNotification = Object.assign(localNotification, {trigger: {at: moment(data['scheduled_at']).toDate()}});
    // }
    this.notifications.schedule(localNotification);
  }

  /**
   * On event
   * @param {string} event
   * @return {Observable<any>}
   */
  public on(event: string): Observable<any> {
    return this.notifications.on(event);
  }
}

import { ILocalNotificationAction, ILocalNotificationProgressBar, ILocalNotificationTrigger } from '@ionic-native/local-notifications/ngx';

export interface LocalNotification {
  /**
   * A unique identifier required to clear, cancel, update or retrieve the local notification in the future
   * Default: 0
   */
  id?: number;
  /**
   * First row of the notification
   * Default: Empty string (iOS) or the app name (Android)
   */
  title?: string;
  /**
   * Second row of the notification
   * Default: Empty string
   */
  text?: string | string[];
  /**
   * The number currently set as the badge of the app icon in Springboard (iOS) or at the right-hand side of the local notification (Android)
   * Default: 0 (which means don't show a number)
   */
  badge?: number;
  /**
   * Arbitrary data, objects will be encoded to JSON string
   * Default: null
   */
  data?: any;
  /**
   * ANDROID ONLY
   * Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled.
   */
  timeoutAfter?: number | false;
  /**
   * Actions id or actions
   */
  actions?: string | ILocalNotificationAction[];
  /**
   * When to trigger the notification
   */
  trigger?: ILocalNotificationTrigger;
  /**
   * A list of image attachments
   */
  attachments?: string[];
  /**
   * Shows a progress bar
   * Setting a boolean is a shortcut for {enabled: true/false} respectively
   */
  progressBar?: ILocalNotificationProgressBar | boolean;
  /**
   * ANDROID ONLY
   * If multiple notifications have the same group your app can present
   * them as a single group.
   */
  group?: string;
  /**
   * ANDROID ONLY
   * If set to 'true' this notification could use 'summary' to summarize
   * the contents of the whole group
   */
  groupSummary?: boolean;
  /**
   * ANDROID ONLY
   * Summary of the whole notification group. Should be used in conjuntion
   * with 'groupSummary' set to true
   */
  summary?: string;
  /**
   * ANDROID ONLY
   * Sets the number of items this notification represents.
   */
  number?: number;
  /**
   * ANDROID ONLY
   * Set whether this is an "ongoing" notification.
   * Ongoing notifications cannot be dismissed by the user,
   * so your application or service must take care of canceling them.
   */
  sticky?: boolean;
  /**
   * ANDROID ONLY
   * If set to true the notification will be show in its entirety on all lockscreens.
   * If set to false it will not be revealed on a secure lockscreen.
   */
  lockscreen?: boolean;
  /**
   * ANDROID ONLY
   * Specifies the channel the notification should be delivered on.
   */
  channel?: string;
  /**
   * Make this notification show when app in foreground.
   */
  foreground?: boolean;
}

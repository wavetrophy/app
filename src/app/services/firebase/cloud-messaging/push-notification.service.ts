import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from '@ionic/angular';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  /**
   * PushNotificationService constructor.
   * @param {Firebase} firebase
   * @param {AngularFirestore} firestore
   * @param {Platform} platform
   * @param {AuthService} auth
   */
  constructor(
    private firebase: Firebase,
    private firestore: AngularFirestore,
    private platform: Platform,
    private auth: AuthService,
  ) {
  }

  /**
   * Get the token
   * @returns {Promise<void>}
   */
  public async getToken() {
    let token;

    const platforms = this.platform.platforms();
    let platform = 'undefined';

    if (this.platform.is('android')) {
      token = await this.firebase.getToken();
      platform = 'android';
    }

    if (this.platform.is('ios')) {
      token = await this.firebase.getToken();
      await this.firebase.grantPermission();
      platform = 'ios';
    }

    this.saveToken(token, platform);
  }

  /**
   * Save a token
   * @param {string|any} token
   * @param {string} platform The current platform
   * @returns {Promise<void>}
   */
  private saveToken(token, platform: string) {
    if (!token) {
      return;
    }

    const devicesRef = this.firestore.collection('devices');

    let userId = 0;
    let username = 'anonymous';
    if (this.auth.data && 'user_id' in this.auth.data) {
      userId = this.auth.data.user_id;
      username = this.auth.data.username;
    }

    const data = {
      token: token,
      userId: userId,
      username: username,
      platform: platform,
    };

    return devicesRef.doc(token).set(data);
  }

  /**
   * On notification subscription
   * @returns {Observable<any>}
   */
  public onNotification() {
    return this.firebase.onNotificationOpen();
  }

  /**
   * Subscribe to topic
   * @param {string} topic
   */
  public subscribeTo(topic: string) {
    this.firebase.subscribe(topic);
  }

  /**
   * Unsubscribe from topic
   * @param {string} topic
   */
  public unsubscribeFrom(topic: string) {
    this.firebase.unsubscribe(topic);
  }
}

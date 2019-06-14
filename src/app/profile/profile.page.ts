import { Component, OnDestroy, OnInit } from '@angular/core';
import { Email } from '../services/user/types/email';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { EditEmailPage } from '../modal/email/edit/edit-email.page';
import { EditUsernamePage } from '../modal/username/edit/edit-username.page';
import { CreateEmailPage } from '../modal/email/create/create-email.page';
import { Subscription } from 'rxjs';
import { Phonenumber } from '../services/user/types/phonenumber';
import { CreatePhonenumberPage } from '../modal/phonenumber/create/create-phonenumber.page';
import { EditPhonenumberPage } from '../modal/phonenumber/edit/edit-phonenumber.page';
import { environment } from '../../environments/environment';
import { NetworkService } from '../services/network/network.service';
import { PasswordChangePage } from '../modal/user/password-change/password-change.page';
import { NetworkStatus } from '../services/network/network-status';
import { __ } from '../services/functions';
import { Pro } from '@ionic/pro';
import { CacheService } from '../services/network/cache.service';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  public emails: Email[];
  public phonenumbers: Phonenumber[];
  public username: string;
  public profilePicture: { url: string } | any;
  public server = '';
  public version = '1.0.0-default';
  private subs: Subscription[] = [];

  /**
   * Constructor
   * @param {UserService} userService
   * @param {AuthService} auth
   * @param {ModalController} modal
   * @param {AlertController} alert
   * @param {LoadingController} loading
   * @param {NetworkService} network
   * @param {CacheService} cache
   */
  public constructor(
    private userService: UserService,
    private auth: AuthService,
    private modal: ModalController,
    private alert: AlertController,
    private loading: LoadingController,
    private network: NetworkService,
    private cache: CacheService,
  ) {
    this.server = environment.api.url;
  }

  /**
   * On init hook.
   */
  public async ngOnInit() {
    this.getEmails();
    this.getPhonenumbers();
    this.username = this.auth.data.username;
    this.profilePicture = this.auth.data.profile_picture || {url: 'default/profile-picture.svg'};
    // todo add profile picture upload from gallery
    const version = await Pro.deploy.getCurrentVersion();
    if (version) {
      this.version = version.binaryVersion + '-' + version.buildId + '.' + version.channel.toLowerCase();
    }
  }

  /**
   * On destroy hook.
   */
  public ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  /**
   * Reload the data
   * @param event
   * @return {Promise<void>}
   */
  public async reload(event) {
    if (this.network.currentNetworkStatus() === NetworkStatus.ONLINE) {
      const promiseEmail = this.getEmails(true).toPromise();
      const promisePhonenumber = this.getPhonenumbers(true).toPromise();
      await Promise.all([promiseEmail, promisePhonenumber]);
    }
    event.target.complete();
  }

  /**
   * Change the profile image.
   * @return {Promise<void>}
   */
  public async changeProfileImage() {
    const alert = await this.alert.create({
      header: __('Nicht verfügbar'),
      message: __('Du kannst Dein Profilbild in der nächsten Version der App ändern.'),
      buttons: [{
        text: 'OK',
        role: 'cancel',
      }],
    });
    alert.present();
  }

  /**
   * Edit username.
   * @returns {Promise<void>}
   */
  public async editUsername() {
    const modal = await EditUsernamePage.asModal(this.modal, this.auth.data.user_id, this.username);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      // The user has to log in if he changes the username.
      this.auth.logout();
    }
  }

  /**
   * Edit email.
   * @param {Email} email
   * @returns {Promise<void>}
   */
  public async editEmail(email: Email) {
    const modal = await EditEmailPage.asModal(this.modal, email, this.username);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      if (email.email === this.username) {
        // The user has to log in if he changes the username.
        this.auth.logout();
        return;
      }
      this.getEmails();
    }
  }

  /**
   * Add email.
   * @returns {Promise<void>}
   */
  public async addEmail() {
    const modal = await CreateEmailPage.asModal(this.modal, this.auth.data.user_id);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      this.getEmails();
    }
  }

  /**
   * Remove email.
   * @param {Email} email
   * @returns {Promise<void>}
   */
  public async removeEmail(email: Email) {
    if (email.is_primary) {
      const error = await this.alert.create({
        header: 'Error',
        message: 'Du kannst nicht deine primäre Emailadresse löschen.',
        buttons: [{text: 'OK', role: 'dismiss'}],
      });
      await error.present();
      return;
    }
    const message = __('Die Email wird auch von Deinem öffentlichen Kontakt entfernt. Andere Teilnehmer der WAVE können nun deine Email (wenn diese öffentlich ist) nicht mehr sehen. Bist Du sicher?');
    const alert = await this.alert.create({
      header: __('Email löschen'),
      message: message,
      buttons: [
        {
          text: __('Abbrechen'),
          role: 'cancel',
        }, {
          text: 'Remove',
          handler: async () => {
            const loader = await this.loading.create({
              message: __('Laden'),
              spinner: 'crescent',
            });
            loader.present();
            const response = await this.userService.removeEmail(email).toPromise();
            loader.dismiss();
            if (response === null) {
              this.getEmails();
            } else {
              this.alert.create({
                header: __('Fehler'),
                message: __('Löschen der Email fehlgeschlagen. Bitte versuche es später erneut'),
                buttons: [{text: 'OK', role: 'dismiss'}],
              });
            }
          },
        },
      ],
    });
    alert.present();
  }

  /**
   * Edit phonenumber.
   * @param {Phonenumber} phonenumber
   * @returns {Promise<void>}
   */
  public async editPhonenumber(phonenumber: Phonenumber) {
    const modal = await EditPhonenumberPage.asModal(this.modal, phonenumber);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      this.getPhonenumbers();
    }
  }

  /**
   * Add phonenumber
   * @returns {Promise<void>}
   */
  public async addPhonenumber() {
    const modal = await CreatePhonenumberPage.asModal(this.modal, this.auth.data.user_id);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      this.getPhonenumbers();
    }
  }

  /**
   * Remove phonenumber.
   * @param {Phonenumber} phonenumber
   * @returns {Promise<void>}
   */
  public async removePhonenumber(phonenumber: Phonenumber) {
    const message = __('Die Telefonnummer wird auch von Deinem öffentlichen Kontakt entfernt. Andere Teilnehmer der WAVE können nun deine Telefonnummer (wenn diese öffentlich ist) nicht mehr sehen. Bist Du sicher?');
    const alert = await this.alert.create({
      header: __('Telefonnummer löschen'),
      message: message,
      buttons: [
        {
          text: __('Abbrechen'),
          role: 'cancel',
        }, {
          text: __('Entfernen'),
          handler: async () => {
            const loader = await this.loading.create({
              message: __('Laden'),
              spinner: 'crescent',
            });
            loader.present();
            const response = await this.userService.removePhonenumber(phonenumber).toPromise();
            loader.dismiss();
            if (response === null) {
              this.getPhonenumbers();
            } else {
              this.alert.create({
                header: __('Fehler'),
                message: __('Löschen der Email fehlgeschlagen. Bitte versuche es später erneut.'),
                buttons: [{text: 'OK', role: 'dismiss'}],
              });
            }
          },
        },
      ],
    });
    alert.present();
  }

  /**
   * Clear the cache
   */
  public async clearCache() {
    let alert;
    if (this.network.currentNetworkStatus() === NetworkStatus.ONLINE) {
      const loader = await this.loading.create({
        message: __('Laden'),
        spinner: 'crescent',
      });
      loader.present();
      await this.cache.clear();
      await loader.dismiss();
      alert = await this.alert.create({
        header: __('Cache geleert'),
        message: __('Der cache wurde erfolgreich geleert'),
        buttons: [{
          text: __('OK'),
          role: 'dismiss',
        }],
      });
    } else {
      alert = await this.alert.create({
        header: __('Cache nicht geleert'),
        message: __('Es scheint, als ob Du offline wärst. Deshalb wurde der Cache nicht geleert'),
        buttons: [{
          text: __('OK'),
          role: 'dismiss',
        }],
      });
    }
    alert.present();
  }

  /**
   * Get emails.
   */
  private getEmails(forceReload: boolean = false) {
    const obs = this.userService.getEmails(this.auth.data.user_id, forceReload);
    const sub = obs.subscribe((emails: Email[]) => {
      this.emails = emails;
    });
    this.subs.push(sub);
    return obs;
  }

  /**
   * Get phonenumbers
   */
  private getPhonenumbers(forceReload: boolean = false) {
    const obs = this.userService.getPhonenumbers(this.auth.data.user_id, forceReload);
    const sub = obs.subscribe((phonenumbers: Phonenumber[]) => {
      this.phonenumbers = phonenumbers;
    });
    this.subs.push(sub);
    return obs;
  }

  /**
   * Change password
   */
  public async changePassword() {
    const pwModal = await PasswordChangePage.asModal(this.modal, this.auth.data.user_id.toString());
    const result = await pwModal.onDidDismiss();
    if (result.data.type === 'success') {
      const alert = await this.alert.create({
        header: __('Passwort'),
        message: __('Passwort erfolgreich geändert.'),
        buttons: [{
          text: 'OK',
          role: 'dismiss',
        }],
      });
      alert.present();
    }
  }
}

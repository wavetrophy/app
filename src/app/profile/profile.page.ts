import { Component, OnDestroy, OnInit } from '@angular/core';
import { Email } from '../services/user/types/email';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { EmailPage } from '../modal/edit/email/email.page';
import { UsernamePage } from '../modal/edit/username/username.page';
import { CreateEmailPage } from '../modal/create/email/create-email-page.component';
import { Subscription } from 'rxjs';
import { Phonenumber } from '../services/user/types/phonenumber';
import { CreatePhonenumberPage } from '../modal/create/create-phonenumber/create-phonenumber.page';
import { PhonenumberPage } from '../modal/edit/phonenumber/phonenumber.page';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  public emails: Email[];
  public phonenumbers: Phonenumber[];
  public username: string;
  private subs: Subscription[] = [];

  /**
   * Constructor
   */
  public constructor(
    private userService: UserService,
    private auth: AuthService,
    private modal: ModalController,
    private alert: AlertController,
    private loading: LoadingController,
  ) {
  }

  /**
   * On init hook.
   */
  ngOnInit() {
    this.getEmails();
    this.getPhonenumbers();
    this.username = this.auth.data.username;
    // todo add profile picture upload from gallery
  }

  ngOnDestroy() {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  async editUsername() {
    const modal = await UsernamePage.asModal(this.modal, this.auth.data.user_id, this.username);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data.type === 'success') {
      // The user has to log in if he changes the username.
      this.auth.logout();
    }
  }

  async editEmail(email: Email) {
    const modal = await EmailPage.asModal(this.modal, email, this.username);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data.type === 'success') {
      if (email.email === this.username) {
        // The user has to log in if he changes the username.
        this.auth.logout();
        return;
      }
      this.getEmails();
    }
  }

  async addEmail() {
    const modal = await CreateEmailPage.asModal(this.modal, this.auth.data.user_id);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data.type === 'success') {
      this.getEmails();
    }
  }

  async removeEmail(email: Email) {
    if (email.is_primary) {
      const error = await this.alert.create({
        header: 'Error',
        message: 'You cannot delete your primary email.',
        buttons: [{text: 'OK', role: 'dismiss'}],
      });
      await error.present();
      return;
    }
    const message = 'You remove this email from your public contact by deleting this email.' +
      ' Other people wont see the email anymore (if the email is public). Are you sure?';
    const alert = await this.alert.create({
      header: 'Delete email',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Remove',
          handler: async () => {
            const loader = await this.loading.create({
              message: 'Loading',
              spinner: 'crescent',
            });
            loader.present();
            const response = await this.userService.removeEmail(email).toPromise();
            loader.dismiss();
            console.log('Delete response', response);
            if (response === null) {
              this.getEmails();
            } else {
              this.alert.create({
                header: 'Error',
                message: 'Deleting email failed. Please try again later.',
                buttons: [{text: 'OK', role: 'dismiss'}],
              });
            }
          },
        },
      ],
    });
    alert.present();
  }

  async editPhonenumber(phonenumber: Phonenumber) {
    const modal = await PhonenumberPage.asModal(this.modal, phonenumber);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data.type === 'success') {
      this.getPhonenumbers();
    }
  }

  async addPhonenumber() {
    const modal = await CreatePhonenumberPage.asModal(this.modal, this.auth.data.user_id);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data.type === 'success') {
      this.getPhonenumbers();
    }
  }

  async removePhonenumber(phonenumber: Phonenumber) {
    const message = 'You remove this phonenumber from your public contact by deleting this phonenumber.' +
      ' Other people wont see the phonenummber anymore (if the phonenumber is public). Are you sure?';
    const alert = await this.alert.create({
      header: 'Delete phonenumber',
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Remove',
          handler: async () => {
            const loader = await this.loading.create({
              message: 'Loading',
              spinner: 'crescent',
            });
            loader.present();
            const response = await this.userService.removePhonenumber(phonenumber).toPromise();
            loader.dismiss();
            console.log('Delete response', response);
            if (response === null) {
              this.getPhonenumbers();
            } else {
              this.alert.create({
                header: 'Error',
                message: 'Deleting phonenumber failed. Please try again later.',
                buttons: [{text: 'OK', role: 'dismiss'}],
              });
            }
          },
        },
      ],
    });
    alert.present();
  }

  private getEmails() {
    const sub = this.userService.getEmails(this.auth.data.user_id).subscribe((emails: Email[]) => {
      this.emails = emails;
    });
    this.subs.push(sub);
  }

  private getPhonenumbers() {
    const sub = this.userService.getPhonenumbers(this.auth.data.user_id).subscribe((phonenumbers: Phonenumber[]) => {
      this.phonenumbers = phonenumbers;
    });
    this.subs.push(sub);
  }
}

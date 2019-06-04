import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Modal } from '../../modal';
import { Email } from '../../../services/user/types/email';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';
import { __ } from '../../../services/functions';

@Component({
  selector: 'app-email',
  templateUrl: './edit-email.page.html',
  styleUrls: ['./edit-email.page.scss'],
})
export class EditEmailPage extends Modal implements OnInit {
  @Input() public email: Email;
  @Input() public username: string;
  @Input() public title: any;
  public isEmailEqualToUsername = false;

  /**
   * Constructor
   * @param {ModalController} modal
   * @param {UserService} userService
   * @param {AuthService} auth
   */
  public constructor(
    modal: ModalController,
    private userService: UserService,
    private auth: AuthService,
  ) {
    super(modal);
  }

  /**
   * As modal.
   * @param {ModalController} modalController
   * @param {Email} email
   * @param {string} username
   * @returns {Promise<HTMLIonModalElement>}
   */
  public static async asModal(
    modalController: ModalController,
    email: Email,
    username: string,
  ) {
    const modal = await modalController.create({
      component: EditEmailPage,
      componentProps: {
        username: username,
        // clone object to prevent editing the regular email...
        email: Object.assign({}, email),
        title: __('Email bearbeiten'),
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    modal.present();
    return modal;
  }


  /**
   * On Save hook
   * @returns {Promise<boolean>}
   */
  public async onSave(): Promise<boolean> {
      this.email = await this.userService.updateEmail(this.email).toPromise();
      return true;
  }

  /**
   * Ng on init hook.
   */
  public ngOnInit(): void {
    this.isEmailEqualToUsername = this.username === this.email.email;
  }
}

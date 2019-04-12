import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Modal } from '../../modal';
import { Email } from '../../../services/user/types/email';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.page.html',
  styleUrls: ['./email.page.scss'],
})
export class EmailPage extends Modal {
  @Input() public email: Email;
  @Input() public username: string;
  @Input() public title: any;

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
   * @returns {Promise<void>}
   */
  public static async asModal(
    modalController: ModalController,
    email: Email,
    username: string,
  ) {
    const modal = await modalController.create({
      component: EmailPage,
      componentProps: {
        username: username,
        email: email,
        title: 'Edit email',
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    modal.present();
  }


  /**
   * On Save hook
   * @returns {Promise<boolean>}
   */
  public async onSave(): Promise<boolean> {
    const res = await this.userService.updateEmail(this.email).toPromise();
    this.email = res;
    return true;
  }
}

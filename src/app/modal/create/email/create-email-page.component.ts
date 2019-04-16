import { Component, Input } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-email',
  templateUrl: './create-email-page.component.html',
  styleUrls: ['./create-email-page.component.scss'],
})
export class CreateEmailPage extends Modal {
  @Input() public userId: number;
  public email: string;
  public isPublic = true;

  /**
   * Constructor.
   * @param {ModalController} modal
   * @param {UserService} user
   */
  constructor(
    modal: ModalController,
    private user: UserService,
  ) {
    super(modal);
  }

  /**
   * Get a create email page as modal.
   * @param {ModalController} modalController
   * @param {number} userId
   * @returns {Promise<HTMLIonModalElement>}
   */
  public static async asModal(modalController: ModalController, userId: number) {
    const modal = await modalController.create({
      component: CreateEmailPage,
      componentProps: {
        userId: userId,
        title: 'Add email',
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    await modal.present();

    return modal;
  }


  /**
   * On Save hook
   * @returns {Promise<any>}
   */
  protected async onSave(): Promise<any> {
    if (!this.email) {
      this.error = 'Required';
      return;
    }
    const email = await this.user.createEmail(this.userId, this.email, this.isPublic).toPromise();
    return Object.keys(email).includes('id');
  }
}

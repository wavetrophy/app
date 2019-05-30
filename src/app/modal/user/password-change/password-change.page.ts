import { Component, Input } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.page.html',
  styleUrls: ['./password-change.page.scss'],
})
export class PasswordChangePage extends Modal {
  @Input() public userId: string;
  public password: string;

  /**
   * Constructor
   * @param {ModalController} modal
   * @param {UserService} userService
   */
  constructor(
    modal: ModalController,
    private userService: UserService,
  ) {
    super(modal);
  }

  /**
   * As modal
   * @param {ModalController} modalController
   * @param userId
   * @return {Promise<HTMLIonModalElement>}
   */
  public static async asModal(modalController: ModalController, userId: string) {
    const modal = await modalController.create({
      component: PasswordChangePage,
      componentProps: {
        userId: userId,
        title: 'Change password',
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    await modal.present();

    return modal;
  }

  /**
   * On save hook
   * @return {Promise<void>}
   */
  public async onSave() {
    const response = await this.userService.updatePassword(this.userId, this.password).toPromise();
    return 'success' in response ? response['success'] : false;
  }
}

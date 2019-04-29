import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Modal } from '../../modal';
import { UserService } from '../../../services/user/user.service';
import { User } from '../../../services/user/types/user';

@Component({
  selector: 'app-username',
  templateUrl: './edit-username.page.html',
  styleUrls: ['./edit-username.page.scss'],
})
export class EditUsernamePage extends Modal {
  @Input() public value: string;
  @Input() public userId: number;
  @Input() public title: any;

  /**
   * Constructor
   * @param {ModalController} modal
   * @param {UserService} user
   */
  public constructor(
    modal: ModalController,
    private user: UserService,
  ) {
    super(modal);
  }

  /**
   * As modal
   * @param {ModalController} modalController
   * @param {number} userId
   * @param {string} username
   * @returns {Promise<void>}
   */
  public static async asModal(
    modalController: ModalController,
    userId: number,
    username: string,
  ) {
    const modal = await modalController.create({
      component: EditUsernamePage,
      componentProps: {
        value: username,
        userId: userId,
        title: 'Edit username',
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    modal.present();
    return modal;
  }


  /**
   * On save hook
   * @returns {Promise<boolean>}
   */
  protected async onSave() {
    const response = await this.user.updateUser(<User>{
      id: this.userId,
      username: this.value,
    }).toPromise();
    if (this.value === response.username) {
      return true;
    }

    this.error = 'Could not save username';
    return false;
  }
}

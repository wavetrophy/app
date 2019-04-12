import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Modal } from '../../modal';

@Component({
  selector: 'app-username',
  templateUrl: './username.page.html',
  styleUrls: ['./username.page.scss'],
})
export class UsernamePage extends Modal {
  @Input() public value: any;
  @Input() public title: any;

  /**
   * Constructor
   * @param {ModalController} modal
   */
  public constructor(modal: ModalController) {
    super(modal);
  }

  /**
   * As modal
   * @param {ModalController} modalController
   * @param {string} username
   * @returns {Promise<void>}
   */
  public static async asModal(
    modalController: ModalController,
    username: string,
  ) {
    const modal = await modalController.create({
      component: UsernamePage,
      componentProps: {
        value: username,
        title: 'Edit username',
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    modal.present();
  }


  /**
   * On save hook
   * @returns {Promise<boolean>}
   */
  protected onSave() {
    return new Promise(resolve => setTimeout(() => resolve(true), 3000));
  }
}

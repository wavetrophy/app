import { Component, Input } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-email',
  templateUrl: './create-phonenumber.page.html',
  styleUrls: ['./create-phonenumber.page.scss'],
})
export class CreatePhonenumberPage extends Modal {
  @Input() public userId: number;
  public countryCode: string;
  public phonenumber: string;
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
      component: CreatePhonenumberPage,
      componentProps: {
        userId: userId,
        title: 'Add phonenumber',
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
    if (!this.phonenumber || !this.countryCode) {
      this.error = 'Required';
      return;
    }
    const email = await this.user.createPhonenumber(this.userId, this.countryCode, this.phonenumber, this.isPublic).toPromise();
    return Object.keys(email).includes('id');
  }
}

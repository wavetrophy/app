import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from '../../../services/user/user.service';
import { Modal } from '../../modal';
import { Phonenumber } from '../../../services/user/types/phonenumber';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-phonenumber',
  templateUrl: './edit-phonenumber.page.html',
  styleUrls: ['./edit-phonenumber.page.scss'],
})
export class EditPhonenumberPage extends Modal {
  @Input() public phonenumber: Phonenumber;
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
   * @param {Phonenumber} phonenumber
   * @returns {Promise<HTMLIonModalElement>}
   */
  public static async asModal(
    modalController: ModalController,
    phonenumber: Phonenumber,
  ) {
    const modal = await modalController.create({
      component: EditPhonenumberPage,
      componentProps: {
        // clone object to prevent editing the regular phonenumber...
        phonenumber: Object.assign({}, phonenumber),
        title: 'Edit phonenumber',
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
    this.phonenumber = await this.userService.updatePhonenumber(this.phonenumber).toPromise();
    return true;
  }
}


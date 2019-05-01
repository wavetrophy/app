import { Component, Input } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';
import { Contact } from '../../../services/contacts/interfaces';
import { environment } from '../../../../environments/environment';
import { Phonenumber } from '../../../services/user/types/phonenumber';
import { Email } from '../../../services/user/types/email';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.page.html',
  styleUrls: ['./view-contact.page.scss'],
})
export class ViewContactPage extends Modal {
  @Input() public contact: Contact;
  public server: string;

  /**
   * ViewContactPage constructor
   * @param {ModalController} modal
   */
  constructor(modal: ModalController) {
    super(modal);
    this.server = environment.api.url;
  }

  /**
   * As modal.
   * @param {ModalController} modalController
   * @param contact
   * @returns {Promise<HTMLIonModalElement>}
   */
  public static async asModal(
    modalController: ModalController,
    contact: Contact,
  ) {
    const modal = await modalController.create({
      component: ViewContactPage,
      componentProps: {
        // clone object to prevent editing the regular email...
        contact: Object.assign({}, contact),
        title: `${contact.first_name} ${contact.last_name}`,
      },
      showBackdrop: true,
      backdropDismiss: true,
    });
    modal.present();
    return modal;
  }

  public call(phonenumber: Phonenumber) {
    document.location.href = `tel:${phonenumber.country_code}${phonenumber.phonenumber}`;
  }

  public sendEmail(email: Email) {
    document.location.href = `mailto:${email.email}`;
  }

  protected async onSave(): Promise<any> {
    return undefined;
  }
}

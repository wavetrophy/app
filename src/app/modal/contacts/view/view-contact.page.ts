import { Component, Input } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';
import { Contact } from '../../../services/contacts/interfaces';
import { environment } from '../../../../environments/environment';
import { Phonenumber } from '../../../services/user/types/phonenumber';
import { Email } from '../../../services/user/types/email';
import { NetworkService } from '../../../services/network/network.service';
import { NetworkStatus } from '../../../services/network/network-status';
import { ContactService } from '../../../services/contacts/contact.service';
import { AuthService } from '../../../services/auth/auth.service';

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
   * @param {NetworkService} network
   * @param {ContactService} contactService
   * @param {AuthService} auth
   */
  constructor(
    modal: ModalController,
    private network: NetworkService,
    private contactService: ContactService,
    private auth: AuthService,
  ) {
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


  /**
   * Reload the data
   * @param event
   * @return {Promise<void>}
   */
  public async reload(event) {
    if (this.network.currentNetworkStatus() === NetworkStatus.ONLINE) {
      await this.getContact(true);
    }
    event.target.complete();
  }

  /**
   * Get contact
   * @param {boolean} forceReload
   * @return {Promise<void>}
   */
  public async getContact(forceReload: boolean = false) {
    return this.contactService.getContact(this.contact, this.auth.data.current_wave.id, forceReload).toPromise();
  }

  /**
   * Call
   * @param {Phonenumber} phonenumber
   */
  public call(phonenumber: Phonenumber) {
    document.location.href = `tel:${phonenumber.country_code}${phonenumber.phonenumber}`;
  }

  /**
   * Send email
   * @param {Email} email
   */
  public sendEmail(email: Email) {
    document.location.href = `mailto:${email.email}`;
  }

  /**
   * On save callback
   * @return {Promise<any>}
   */
  protected async onSave(): Promise<any> {
    return true;
  }
}

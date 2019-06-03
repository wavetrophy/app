import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from '../../services/contacts/contact.service';
import { Contact, Group } from '../../services/contacts/interfaces';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';
import { ViewContactPage } from '../../modal/contacts/view/view-contact.page';
import { ModalController } from '@ionic/angular';
import { e, empty } from '../../services/functions';
import { NetworkStatus } from '../../services/network/network-status';
import { NetworkService } from '../../services/network/network.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit, OnDestroy {
  public contacts: { group: Group, users: Contact[] }[] = [];
  public errormessage: string;
  public isLoading = false;
  public readonly server: string;
  private subs: Subscription[] = [];

  /**
   * Contacts page constructor
   * @param {ContactService} contactService
   * @param {AuthService} auth
   * @param {ModalController} modal
   * @param {NetworkService} network
   */
  public constructor(
    private contactService: ContactService,
    private auth: AuthService,
    private modal: ModalController,
    private network: NetworkService,
  ) {
    this.server = environment.api.url;
  }

  /**
   * On init hook.
   */
  public ngOnInit() {
    this.getContacts();
  }

  /**
   * On destroy hook
   */
  public ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Reload the data
   * @param event
   * @return {Promise<void>}
   */
  public async reload(event) {
    if (this.network.currentNetworkStatus() === NetworkStatus.ONLINE) {
      await this.getContacts(true);
    }
    event.target.complete();
  }

  /**
   * View a contact.
   * @param {Contact} contact
   */
  public async viewContact(contact: Contact) {
    ViewContactPage.asModal(this.modal, contact);
  }

  /**
   * Get contacts.
   */
  private getContacts(forceReload: boolean = false) {
    this.isLoading = true;
    this.errormessage = 'null';
    // @ts-ignore
    const obs = this.contactService.getContacts(this.auth.data.current_wave.id, forceReload);
    const sub = obs.subscribe((res: any) => {
      this.isLoading = false;
      if (!e(res, 'success')) {
        this.errormessage = e(res, 'message') || 'Keine Kontakte verfügbar';
        return;
      }
      const contacts = [];
      res.contacts.map((contact) => {
        const group = contact.group || {
          id: 0,
          name: 'User',
        };
        if (!(group.id in contacts)) {
          contacts[group.id] = {
            group: group,
            users: [],
          };
        }
        contacts[group.id].users.push(contact);
      });

      this.contacts = contacts.filter(function (el) {
        return el != null;
      });
      if (empty(this.contacts)) {
        this.errormessage = 'Keine Kontakte verfügbar';
      }
    }, (res: any) => {
      this.isLoading = false;
      this.errormessage = e(res, 'message') || 'Es ist ein Fehler aufgetreten';
    });
    this.subs.push(sub);
  }
}

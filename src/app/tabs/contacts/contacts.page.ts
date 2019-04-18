import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContactService } from '../../services/contacts/contact.service';
import { Contact, Group } from '../../services/contacts/interfaces';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

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
   */
  public constructor(
    private contactService: ContactService,
    private auth: AuthService,
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
   * Get contacts.
   */
  private getContacts() {
    this.isLoading = true;
    const sub = this.contactService.getContacts(this.auth.data.current_wave).subscribe((res: any) => {
      this.isLoading = false;
      if (!res['success']) {
        this.errormessage = res['message'];
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
      console.log(this.contacts);
    }, (res: any) => {
      this.isLoading = false;
      this.errormessage = res['message'] || 'Es ist ein Fehler aufgetreten';
    });
    this.subs.push(sub);
  }
}

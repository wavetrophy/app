import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Contact } from './interfaces';
import { ContactField, ContactFindOptions, ContactName, ContactOrganization } from '@ionic-native/contacts';
import { WaveService } from '../wave/wave.service';
import { AuthService } from '../auth/auth.service';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly url: string;

  /**
   * ContactService constructor
   * @param {Diagnostic} diagnostics
   * @param {HttpClient} http
   * @param {WaveService} waveService
   * @param {auth} auth
   */
  constructor(
    private diagnostics: Diagnostic,
    private http: HttpClient,
    private waveService: WaveService,
    private auth: AuthService,
  ) {
    this.url = environment.api.url + '/api';
  }

  /**
   * Get contacts of a wave
   * @param waveId
   * @returns {Observable<Object>}
   */
  public getContacts(waveId): Observable<Object> {
    const url = `${this.url}/waves/${waveId}/contacts`;
    return this.http.get(url);
  }

  /**
   * Check if native contacts are available.
   * @returns {boolean}
   */
  public isNativeAvailable(): boolean {
    return 'contacts' in navigator;
  }

  /**
   * Save one contact.
   * @param {Contact} contact
   * @returns {Promise<any>}
   */
  public async save(contact: Contact): Promise<any> {
    if (!this.isNativeAvailable()) {
      return;
    }
    const found = await this.findBy(`wavetrophy-${contact.id}`, [navigator['contacts'].fieldType.id]);
    if (found) {
      return found;
    }
    return this.saveContact(contact);
  }

  /**
   * Save many.
   * @param {Contact[]} contacts
   * @returns {Promise<void>}
   */
  public async saveMany(contacts: Contact[]) {
    if (!this.isNativeAvailable()) {
      return;
    }
    const values = [];
    contacts.forEach(contact => values.push(`wavetrophy-${contact.id}`));
    const found = <any[]>await this.findBy(values, [navigator['contacts'].fieldType.id]);
    console.log('found contacts', found);
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const match = found.find((element) => {
        return element.id === `wavetrophy-${contact.id}`;
      });
      if (!match) {
        // maybe make synchronous?
        try {
          await this.saveContact(contact);
        } catch (e) {
          console.log(e);
        }
      }
    }
  }

  /**
   * Find a contact by a field.
   * @param value
   * @param {any[]} fields
   * @returns {Promise<any>}
   */
  public findBy(value: any, fields: string[] = [navigator['contacts'].fieldType.displayName, navigator['contacts'].fieldType.name]) {
    console.log('findBy', fields);
    if (!this.isNativeAvailable()) {
      return;
    }
    return new Promise((resolve, reject) => {
        const options = new ContactFindOptions();
        options.filter = value;
        options.multiple = true;
        options.desiredFields = navigator['contacts'].fieldType;
        options.hasPhoneNumber = true;
        navigator['contacts'].find(fields, resolve, reject, options);
      },
    );
  }

  /**
   * Save a contact
   * @param {Contact} contact
   * @returns {Promise<Promise<Promise<any>>>}
   */
  private async saveContact(contact: Contact) {
    this.diagnostics.isContactsAuthorized()
      .then((state) => {
        console.log('state', state);
        if (!state) {
          return;
        }

        const displayName = `${contact.first_name} ${contact.last_name}`;

        const contactToSave = navigator['contacts'].create();
        contactToSave.id = `wavetrophy-${contact.id}`;
        contactToSave.displayName = displayName;
        // specify both to support all devices
        contactToSave.nickname = displayName;

        // Save contact name
        const name = new ContactName();
        name.givenName = contact.first_name;
        name.familyName = contact.last_name;
        contactToSave.name = name;

        // Save phonenumbers
        const phonenumbers = [];
        for (let i = 0; i < contact.phonenumbers.length; i++) {
          const phonenumber = contact.phonenumbers[i];
          const phonenumberField = new ContactField('', phonenumber.country_code + phonenumber.phonenumber);
          phonenumbers.push(phonenumberField);
        }
        contactToSave.phonenumbers = phonenumbers;

        // Save emails
        const emails = [];
        for (let i = 0; i < contact.emails.length; i++) {
          const email = contact.emails[i];
          const emailField = new ContactField('', email.email);
          emails.push(emailField);
        }
        contactToSave.emails = emails;

        // Save organization
        contactToSave.organizations = [
          new ContactOrganization(
            '',
            `WAVETROPHY ${this.auth.data.current_wave.name}`,
            contact.group.name,
            'Teilnehmer',
            true,
          ),
        ];

        return new Promise((resolve, reject) => {
          const a = (p) => {
            console.log('success', p);
            resolve(p);
          };
          const b = (p) => {
            console.log('error', p);
            resolve(p);
          };
          console.log('saving');
          contactToSave.save(a, b);
        });
      }).catch(e => console.error(e));
  }
}

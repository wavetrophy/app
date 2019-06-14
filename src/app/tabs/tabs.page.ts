import { Component, NgZone } from '@angular/core';
import { StreamPage } from './stream/stream.page';
import { MainOptionsPage } from '../popover/main-options/main-options.page';
import { PopoverController } from '@ionic/angular';
import { ContactsPage } from './contacts/contacts.page';
import { FaqPage } from './faq/faq.page';
import { HotelsPage } from './hotels/hotels.page';
import { ConsoleLogger } from '../services/logger/logger';

const logger = new ConsoleLogger('TABS');
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  public streamPage: any = StreamPage;
  public contactsPage: any = ContactsPage;
  public faqPage: any = FaqPage;
  public hotelsPage: any = HotelsPage;

  /**
   * Constructor
   * @param {PopoverController} popover
   * @param {NgZone} ng
   */
  public constructor(private popover: PopoverController, private ng: NgZone) {
  }

  /**
   * Ion view will enter
   */
  public ionViewWillEnter(): void {
    console.log('LOADED TABS');
    this.ng.run(() => logger.info('Force reloaded tabs'));
  }

  /**
   * Open options page
   * @param event
   * @return {Promise<any>}
   */
  public async openOptions(event) {
    const popover = await this.popover.create({
      component: MainOptionsPage,
      showBackdrop: false,
      event: event,
      translucent: false,
    });
    return await popover.present();
  }
}

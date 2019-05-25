import { Component } from '@angular/core';
import { StreamPage } from './stream/stream.page';
import { MainOptionsPage } from '../popover/main-options/main-options.page';
import { PopoverController } from '@ionic/angular';
import { ContactsPage } from './contacts/contacts.page';
import { FaqPage } from './faq/faq.page';
import { HotelsPage } from './hotels/hotels.page';


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

  public constructor(private popover: PopoverController) {
  }

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

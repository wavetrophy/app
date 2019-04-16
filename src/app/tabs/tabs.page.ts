import { Component } from '@angular/core';
import { StreamPage } from './stream/stream.page';
import { Tab2Page } from '../tab2/tab2.page';
import { Tab3Page } from '../tab3/tab3.page';
import { MainOptionsPage } from '../popover/main-options/main-options.page';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  public streamPage: any = StreamPage;
  public tab2Page: any = Tab2Page;
  public tab3Page: any = Tab3Page;

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

import { Component } from '@angular/core';
import { MainOptionsPage } from '../popover/main-options/main-options.page';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  /**
   * Constructor
   * @param {PopoverController} popover
   */
  public constructor(private popover: PopoverController) {
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

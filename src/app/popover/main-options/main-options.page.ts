import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-main-options',
  templateUrl: './main-options.page.html',
  styleUrls: ['./main-options.page.scss'],
})
export class MainOptionsPage {

  constructor(private popoverCtrl: PopoverController) {

  }

  async dismiss() {
    try {
      await this.popoverCtrl.dismiss();
    } catch (e) {
      // click more than one time popover throws error, so ignore...
    }

  }
}

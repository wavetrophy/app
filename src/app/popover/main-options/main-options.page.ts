import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-main-options',
  templateUrl: './main-options.page.html',
  styleUrls: ['./main-options.page.scss'],
})
export class MainOptionsPage {
  /**
   * MainOptionsPage constructor.
   * @param {PopoverController} popoverCtrl
   * @param {AuthService} auth
   */
  constructor(private popoverCtrl: PopoverController, private auth: AuthService) {
  }

  /**
   * Dismiss popover.
   * @returns {Promise<void>}
   */
  async dismiss() {
    try {
      await this.popoverCtrl.dismiss();
    } catch (e) {
      // click more than one time popover throws error, so ignore...
    }
  }

  async logout() {
    this.dismiss();
    await this.auth.logout();
  }
}

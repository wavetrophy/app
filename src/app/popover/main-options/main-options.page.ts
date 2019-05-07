import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { AuthService } from '../../services/auth/auth.service';
import { ChooseTeamPage } from '../../modal/team/choose/choose-team.page';
import { environment } from '../../../environments/environment';
import { Storage } from '@ionic/storage';
import { TeamService } from '../../services/team/team.service';
import { GroupService } from '../../services/group/group.service';

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
   * @param {ModalController} modal
   * @param {Storage} storage
   * @param {TeamService} teamService
   * @param {GroupService} groupService
   */
  constructor(
    private popoverCtrl: PopoverController,
    private auth: AuthService,
    private modal: ModalController,
    private storage: Storage,
    private teamService: TeamService,
    private groupService: GroupService,
  ) {
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

  /**
   * Open the team chooser.
   */
  public async openTeamChooser() {
    let team = null;
    if (this.auth.data.team_id) {
      team = await this.teamService.getTeam(this.auth.data.team_id).toPromise();
    }

    let group = null;
    if (this.auth.data.group_id) {
      group = await this.groupService.getGroup(this.auth.data.group_id).toPromise();
    }

    this.dismiss();

    const modal = await ChooseTeamPage.asModal(this.modal, this.auth.data.current_wave, group, team);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      const refreshToken = await this.storage.get(environment.storage.TOKEN_REFRESH_KEY);
      await this.auth.refresh(refreshToken).toPromise();
    }
  }

  /**
   * Logout a user.
   * @return {Promise<void>}
   */
  async logout() {
    this.dismiss();
    await this.auth.logout();
  }
}

import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, PopoverController } from '@ionic/angular';
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
export class MainOptionsPage implements OnInit {
  public showTeamChooser = false;

  /**
   * MainOptionsPage constructor.
   * @param {PopoverController} popoverCtrl
   * @param {AuthService} auth
   * @param {ModalController} modal
   * @param {Storage} storage
   * @param {TeamService} teamService
   * @param {GroupService} groupService
   * @param {NavController} nav
   */
  constructor(
    private popoverCtrl: PopoverController,
    private auth: AuthService,
    private modal: ModalController,
    private storage: Storage,
    private teamService: TeamService,
    private groupService: GroupService,
    private nav: NavController,
  ) {
  }

  /**
   * On init hook.
   */
  public ngOnInit(): void {
    this.showTeamChooser = !!this.auth.data.team_id;
  }

  public async openProfile() {
    this.dismiss();
    this.nav.navigateForward(['/', 'profile']);
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
    this.dismiss();

    if (!this.auth.data.team_id) {
      return;
    }

    const modal = await ChooseTeamPage.asModal(this.modal, this.auth.data.current_wave);
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

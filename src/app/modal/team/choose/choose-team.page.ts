import { Component, Input, OnInit } from '@angular/core';
import { Modal } from '../../modal';
import { ModalController } from '@ionic/angular';
import { TeamService } from '../../../services/team/team.service';
import { Wave } from '../../../services/wave/types/wave';
import { Group } from '../../../services/contacts/interfaces';
import { Team } from '../../../services/user/types/team';
import { GroupService } from '../../../services/group/group.service';
import { UserService } from '../../../services/user/user.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-choose-team',
  templateUrl: './choose-team.page.html',
  styleUrls: ['./choose-team.page.scss'],
})
export class ChooseTeamPage extends Modal implements OnInit {
  @Input() public wave: Wave;
  @Input() public selectedTeam: Team = null;
  @Input() public selectedGroup: Group = null;
  public isLoading = false;
  public isLoadingTeams = false;
  public isSaveable = false;
  public groups: Group[] = [];
  public groupSelectionOptions = {header: 'Group'};
  public teams: Team[] = [];
  public teamSelectionOptions = {header: 'Team'};

  /**
   * As modal
   * @param {ModalController} modalController
   * @param {Wave} wave
   * @param {Group} group
   * @param {Team} team
   * @returns {Promise<void>}
   */
  public static async asModal(
    modalController: ModalController,
    wave: Wave,
    group?: Group,
    team?: Team,
  ) {
    const modal = await modalController.create({
      component: ChooseTeamPage,
      componentProps: {
        wave: wave,
        title: 'Edit team',
        team: team,
        group: group,
      },
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'modal-auto-height modal-end',
    });
    modal.present();
    return modal;
  }

  /**
   * Comparison method.
   * @param o1
   * @param o2
   * @return {boolean}
   */
  public compareWith = (o1, o2) => o1 && o2 ? o1.id === o2.id : o1 === o2;

  /**
   * Constructor
   * @param {ModalController} modalController
   * @param {TeamService} teamService
   * @param {GroupService} groupService
   * @param {AuthService} auth
   * @param {UserService} user
   */
  constructor(
    modalController: ModalController,
    private teamService: TeamService,
    private groupService: GroupService,
    private auth: AuthService,
    private user: UserService,
  ) {
    super(modalController);
  }

  /**
   * On init hook
   */
  public ngOnInit() {
    this.getGroups();
  }

  /**
   * On group change hook
   */
  public onGroupChange() {
    if (!this.selectedGroup) {
      return;
    }
    this.getTeams(this.selectedGroup);
  }

  /**
   * On team change hook
   */
  public onTeamChange() {
    this.isSaveable = !!this.selectedTeam;
  }

  /**
   * On save hook
   * @return {Promise<any>}
   */
  protected async onSave(): Promise<any> {
    this.returnData = {group: this.selectedGroup, team: this.selectedTeam};
    const user = await this.user.joinTeam(this.auth.data.user_id, this.selectedTeam).toPromise();
    return Object.keys(user).includes('team') ? Object.keys(user.team).includes('id') : false;
  }

  /**
   * Get all groups
   */
  private getGroups() {
    this.isLoading = true;
    this.groupService.getGroups(this.wave).subscribe((response: any) => {
      this.isLoading = false;
      if (!response) {
        this.error = response['message'] || 'Keine Gruppen verfügbar';
        return;
      }
      this.groups = response;
      this.onGroupChange();
    });
  }

  /**
   * Get team
   * @param {Group} group
   */
  private getTeams(group: Group) {
    this.isLoadingTeams = true;
    this.teamService.getTeams(this.wave, group).subscribe((response: any) => {
      this.isLoadingTeams = false;
      if (!response) {
        this.error = response['message'] || 'Keine Teams verfügbar';
        return;
      }
      this.teams = response;
    });
  }
}

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
import { PushNotificationService } from '../../../services/firebase/cloud-messaging/push-notification.service';
import { NotificationService } from '../../../services/firebase/cloud-messaging/notification.service';
import { __ } from '../../../services/functions';

@Component({
  selector: 'app-choose-team',
  templateUrl: './choose-team.page.html',
  styleUrls: ['./choose-team.page.scss'],
})
export class ChooseTeamPage extends Modal implements OnInit {
  @Input() public wave: Wave;
  public team: Team = null;
  public group: Group = null;
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
        title: __('Team wählen'),
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
   * @param {PushNotificationService} push
   */
  constructor(
    modalController: ModalController,
    private teamService: TeamService,
    private groupService: GroupService,
    private auth: AuthService,
    private user: UserService,
    private push: PushNotificationService,
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
    if (!this.group) {
      return;
    }
    this.getTeams(this.group);
  }

  /**
   * On team change hook
   */
  public onTeamChange() {
    this.isSaveable = !!this.team;
  }

  /**
   * On save hook
   * @return {Promise<any>}
   */
  protected async onSave(): Promise<any> {
    const oldGroup = this.auth.data.group_id;
    this.returnData = {group: this.group, team: this.team};
    const user = await this.user.joinTeam(this.auth.data.user_id, this.team).toPromise();
    const isSaved = Object.keys(user).includes('team') ? Object.keys(user.team).includes('id') : false;
    if (isSaved) {
      this.push.unsubscribeFrom(NotificationService.TOPIC_GROUP(oldGroup));
      this.push.subscribeTo(NotificationService.TOPIC_GROUP(this.group.id));
    }
    return isSaved;
  }

  /**
   * Get all groups
   */
  private getGroups() {
    this.isLoading = true;
    this.groupService.getGroups(this.wave).subscribe(async (response: any) => {
      if (!response) {
        this.error = response['message'] || __('Keine Gruppen verfügbar');
        return;
      }
      this.groups = response;
      const res: any = await this.groupService.getGroup(this.auth.data.group_id).toPromise();
      if (res) {
        this.group = res;
      } else {
        this.group = this.groups[0];
      }
      this.isLoading = false;
      this.onGroupChange();
    });
  }

  /**
   * Get team
   * @param {Group} group
   */
  private getTeams(group: Group) {
    this.isLoadingTeams = true;
    this.teamService.getTeams(this.wave, group).subscribe(async (response: any) => {
      if (!response) {
        this.error = response['message'] || __('Keine Teams verfügbar');
        return;
      }
      const res: any = await this.teamService.getTeam(this.auth.data.team_id).toPromise();
      if (res) {
        this.team = res;
      } else {
        this.team = this.teams[0];
      }
      this.isLoadingTeams = false;
      this.teams = response;
    });
  }
}

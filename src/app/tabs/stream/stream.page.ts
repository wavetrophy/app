import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StreamService } from '../../services/stream/stream.service';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { ChooseTeamPage } from '../../modal/team/choose/choose-team.page';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { Event } from '../../services/stream/types/event';
import { e, empty } from '../../services/functions';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Class Streampage
 */
export class StreamPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public errormessage = null;
  public events: { [date: string]: Event };
  public server;
  public subs: Subscription[] = [];
  public isLoading = false;
  public moment = moment;
  public joinTeamMessage = 'Join Team';
  public streamType = 'personal';

  /**
   * StreamPage constructor.
   * @param {AuthService} auth
   * @param {StreamService} stream
   * @param {Storage} storage
   * @param {ModalController} modal
   * @param {ChangeDetectorRef} cd
   */
  constructor(
    public auth: AuthService,
    private stream: StreamService,
    private storage: Storage,
    private modal: ModalController,
    private cd: ChangeDetectorRef,
  ) {
    this.server = environment.api.url;
  }

  /**
   * On init hook
   * @returns {Promise<void>}
   */
  public ngOnInit() {
    this.loadStream(this.streamType);
    const sub = this.auth.onDataRefresh().subscribe(() => this.loadStream(this.streamType));
    this.subs.push(sub);
    this.cd.detectChanges();
  }

  /**
   * Change stream
   * @param type
   * @return {Promise<void>}
   */
  public loadStream(type?: string) {
    const userId = this.auth.data.user_id;
    const waveId = this.auth.data.current_wave.id;
    this.streamType = type;
    switch (type) {
      case 'all':
        this.getWaveStream(waveId);
        break;
      case 'personal':
        this.getPersonalStream(userId);
        break;
      default:
        this.getWaveStream(userId);
        break;
    }
  }

  /**
   * Open the team chooser.
   */
  public async openTeamChooser() {
    const modal = await ChooseTeamPage.asModal(this.modal, this.auth.data.current_wave);
    const dismiss = await modal.onDidDismiss();
    if (dismiss.data && dismiss.data.type === 'success') {
      const refreshToken = await this.storage.get(environment.storage.TOKEN_REFRESH_KEY);
      await this.auth.refresh(refreshToken).toPromise();
    }
  }

  /**
   * Get the stream by user
   *
   * @param {number} userId
   *
   * @returns {Promise<void>}
   */
  public getPersonalStream(userId: number) {
    this.isLoading = true;
    this.errormessage = '';
    this.events = null;
    this.cd.detectChanges();

    const sub = this.stream.getByUser(userId).subscribe((res: any) => this.handleSuccess(res), (res: any) => this.handleError(res));
    this.subs.push(sub);
  }

  /**
   * Get the stream by wave
   * @param {number} waveId
   */
  public getWaveStream(waveId: number) {
    this.isLoading = true;
    this.errormessage = '';
    this.events = null;
    this.cd.detectChanges();

    const sub = this.stream.getByWave(waveId).subscribe((res: any) => this.handleSuccess(res), (res: any) => this.handleError(res));
    this.subs.push(sub);
  }

  /**
   * Helper method for the event stream template
   * @param {Object} object
   * @return {string[]}
   */
  public objectKeys(object: Object) {
    return Object.keys(object);
  }

  /**
   * Get start
   * @param {Event} event
   * @return {Date}
   */
  public getStart(event: Event) {
    if ('personal_participation' in event && event.personal_participation !== null) {
      return event.personal_participation.arrival;
    }

    return event.start;
  }

  /**
   * Get end
   * @param {Event} event
   * @return {Date}
   */
  public getEnd(event: Event) {
    if ('personal_participation' in event && event.personal_participation !== null) {
      return event.personal_participation.departure;
    }

    return event.end;
  }

  /**
   * Handle success
   * @param res
   */
  private handleSuccess(res: any) {
    this.isLoading = false;
    if (!e(res, 'success')) {
      this.errormessage = e(res, 'message') || 'Keine Daten verfügbar';
      return;
    }
    this.events = res.events;
    if (empty(this.events)) {
      this.errormessage = 'No Events available for your team';
      this.joinTeamMessage = 'Join a different Team';
    }
    this.cd.detectChanges();
  }

  /**
   * Handle error
   * @param res
   */
  private handleError(res: any) {
    this.isLoading = false;
    this.errormessage = e(res, 'message') || 'Es ist ein Fehler aufgetreten';
    this.joinTeamMessage = 'Join a Team';
    this.cd.detectChanges();
  }
}

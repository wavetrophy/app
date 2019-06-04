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
import { __, e, empty } from '../../services/functions';
import { NetworkService } from '../../services/network/network.service';
import { NetworkStatus } from '../../services/network/network-status';

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
  public events: { [date: string]: Event[] };
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
   * @param {NetworkService} network
   */
  constructor(
    public auth: AuthService,
    private stream: StreamService,
    private storage: Storage,
    private modal: ModalController,
    private cd: ChangeDetectorRef,
    private network: NetworkService,
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
   * Reload the data
   * @param event
   * @return {Promise<void>}
   */
  public async reload(event) {
    if (this.network.currentNetworkStatus() === NetworkStatus.ONLINE) {
      await this.loadStream(this.streamType, true);
    }

    event.target.complete();
  }

  /**
   * Change stream
   * @param type
   * @param forceReload
   * @return {Promise<void>}
   */
  public async loadStream(type?: string, forceReload: boolean = false) {
    const userId = this.auth.data.user_id;
    const waveId = this.auth.data.current_wave.id;
    this.streamType = type;
    switch (type) {
      case 'all':
        await this.getWaveStream(waveId, forceReload).toPromise();
        break;
      case 'personal':
        await this.getPersonalStream(userId, forceReload).toPromise();
        break;
      default:
        await this.getWaveStream(userId, forceReload).toPromise();
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
   * @param forceReload
   * @returns {Observable}
   */
  public getPersonalStream(userId: number, forceReload: boolean = true) {
    this.isLoading = true;
    this.errormessage = '';
    this.events = null;
    this.cd.detectChanges();

    const obs = this.stream.getByUser(userId, forceReload);
    const sub = obs.subscribe((res: any) => this.handleSuccess(res), (res: any) => this.handleError(res));
    this.subs.push(sub);

    return obs;
  }

  /**
   * Get the stream by wave
   * @param {number} waveId
   * @param forceReload
   */
  public getWaveStream(waveId: number, forceReload: boolean = false) {
    this.isLoading = true;
    this.errormessage = '';
    this.events = null;
    this.cd.detectChanges();

    const obs = this.stream.getByWave(waveId, forceReload);
    const sub = obs.subscribe((res: any) => this.handleSuccess(res), (res: any) => this.handleError(res));
    this.subs.push(sub);

    return obs;
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
      this.errormessage = e(res, 'message') || __('Keine Daten verfügbar');
      return;
    }

    const events = {};
    Object.keys(res.events).sort().forEach(function (key) {
      const k = key.substr(0, 8);
      if (!events[k]) {
        events[k] = [];
      }
      events[k].push(res.events[key]);
    });
    this.events = events;

    if (empty(this.events)) {
      this.errormessage = __('Keine Events für Dein Team verfügbar');
      this.joinTeamMessage = __('Team wechseln');
    }
    this.cd.detectChanges();
  }

  /**
   * Handle error
   * @param res
   */
  private handleError(res: any) {
    this.isLoading = false;
    this.errormessage = e(res, 'message') || __('Es ist ein Fehler aufgetreten');
    this.joinTeamMessage = __('Team beitreten');
    this.cd.detectChanges();
  }
}

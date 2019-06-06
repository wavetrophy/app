import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import moment from 'moment-timezone';
import { Hotel } from '../../services/stream/types/hotel';
import { StreamService } from '../../services/stream/stream.service';
import { __, e, empty } from '../../services/functions';
import { AuthService } from '../../services/auth/auth.service';
import { NetworkStatus } from '../../services/network/network-status';
import { NetworkService } from '../../services/network/network.service';

@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.page.html',
  styleUrls: ['./hotels.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HotelsPage implements OnInit, OnDestroy {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  public errormessage = null;
  public hotels: { [date: string]: Hotel };
  public server;
  public subs: Subscription[] = [];
  public isLoading = false;
  public moment = moment;

  /**
   * Constructor
   * @param {ChangeDetectorRef} cd
   * @param {StreamService} stream
   * @param {AuthService} auth
   * @param {NetworkService} network
   */
  constructor(
    private cd: ChangeDetectorRef,
    private stream: StreamService,
    private auth: AuthService,
    private network: NetworkService,
  ) {
  }

  /**
   * On init hook
   */
  ngOnInit() {
    const userId = this.auth.data.user_id;
    this.getHotels(userId);
  }

  /**
   * On destroy hook
   */
  public ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Reload the events
   * @param event
   * @return {Promise<void>}
   */
  public async reload(event) {
    if (this.network.currentNetworkStatus() === NetworkStatus.ONLINE) {
      const userId = this.auth.data.user_id;
      await this.getHotels(userId, true).toPromise();
    }

    event.target.complete();
  }

  /**
   * Get all hotels for user
   * @param {number} userId
   * @param forceReload
   */
  private getHotels(userId: number, forceReload: boolean = false) {
    this.isLoading = true;
    this.errormessage = '';
    this.hotels = null;
    this.cd.detectChanges();

    const obs = this.stream.getHotelsByUser(userId, forceReload);
    const sub = obs.subscribe((res: any) => {
      this.isLoading = false;
      if (!e(res, 'success')) {
        this.errormessage = e(res, 'message') || __('Keine Daten verfügbar');
        return;
      }
      this.hotels = res.hotels;
      if (empty(this.hotels)) {
        this.errormessage = __('Keine Hotels für Dein Team verfügbar');
      }
      this.cd.detectChanges();
    }, (res: any) => {
      this.isLoading = false;
      this.errormessage = e(res, 'message') || __('Es ist ein Fehler aufgetreten');
      this.cd.detectChanges();
    });
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
}

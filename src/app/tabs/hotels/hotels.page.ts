import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Hotel } from '../../services/stream/types/hotel';
import { StreamService } from '../../services/stream/stream.service';
import { e, empty } from '../../services/functions';
import { AuthService } from '../../services/auth/auth.service';

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
   */
  constructor(
    private cd: ChangeDetectorRef,
    private stream: StreamService,
    private auth: AuthService,
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
   * Get all hotels for user
   * @param {number} userId
   */
  private getHotels(userId: number) {
    this.isLoading = true;
    this.errormessage = '';
    this.hotels = null;
    this.cd.detectChanges();

    const sub = this.stream.getHotelsByUser(userId).subscribe((res: any) => {
      this.isLoading = false;
      if (!e(res, 'success')) {
        this.errormessage = e(res, 'message') || 'Keine Daten verfügbar';
        return;
      }
      this.hotels = res.hotels;
      if (empty(this.hotels)) {
        this.errormessage = 'No hotels available for your team';
      }
      this.cd.detectChanges();
    }, (res: any) => {
      this.isLoading = false;
      this.errormessage = e(res, 'message') || 'Es ist ein Fehler aufgetreten';
      this.cd.detectChanges();
    });
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
   * Reload the events
   * @param event
   * @return {Promise<void>}
   */
  public async reload(event) {
    event.target.complete();
    const userId = this.auth.data.user_id;
    this.getHotels(userId);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Hotel } from '../services/stream/types/hotel';
import { Subscription } from 'rxjs';
import { e, empty } from '../services/functions';
import { ActivatedRoute } from '@angular/router';
import { StreamService } from '../services/stream/stream.service';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-hotel',
  templateUrl: './hotel.page.html',
  styleUrls: ['./hotel.page.scss'],
})
export class HotelPage implements OnInit, OnDestroy {
  public id;
  public server;
  public moment = moment;
  public hotel?: Hotel;
  public isLoading = false;
  public errormessage: string;
  public url = '';
  private subs: Subscription[] = [];
  public empty = empty;

  /**
   * Constructor
   * @param {ActivatedRoute} ar
   * @param {StreamService} stream
   * @param {AuthService} auth
   */
  constructor(
    private ar: ActivatedRoute,
    private stream: StreamService,
    private auth: AuthService,
  ) {
    this.server = environment.api.url;
  }

  /**
   * On init hook
   */
  public ngOnInit() {
    this.id = parseInt(this.ar.snapshot.paramMap.get('id'), 10);
    this.getHotel(this.auth.data.user_id, this.id);
  }

  /**
   * On destroy hook
   */
  public ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Reload the hotels
   * @param event
   * @return {Promise<void>}
   */
  public async reload(event) {
    event.target.complete();
    this.getHotel(this.auth.data.user_id, this.id);
  }

  /**
   * Get hotel
   * @param {number} userId
   * @param {number} id
   */
  private getHotel(userId: number, id: number) {
    this.isLoading = true;
    this.errormessage = '';
    const sub = this.stream.getHotelByUser(userId, id).subscribe((res: any) => {
      this.isLoading = false;
      if (!e(res, 'success')) {
        this.errormessage =e(res, 'message') || 'Keine Daten verfügbar';
        return;
      }
      this.hotel = res.hotel;
    });
    this.subs.push(sub);
  }
}

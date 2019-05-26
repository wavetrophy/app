import { Component, OnDestroy, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { StreamService } from '../services/stream/stream.service';
import { AuthService } from '../services/auth/auth.service';
import { environment } from '../../environments/environment';
import { Event } from '../services/stream/types/event';
import { e, empty } from '../services/functions';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit, OnDestroy {
  public id;
  public server;
  public moment = moment;
  public event?: Event;
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
  public constructor(
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
    this.getEvent(this.auth.data.user_id, this.id);
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
    event.target.complete();
    this.getEvent(this.auth.data.user_id, this.id);
  }

  /**
   * Get a single event.
   * @param {number} userId
   * @param {number} id
   */
  private getEvent(userId: number, id: number) {
    this.isLoading = true;
    this.errormessage = '';
    const sub = this.stream.getEventByUser(userId, id).subscribe((res: any) => {
      this.isLoading = false;
      if (!e(res, 'success')) {
        this.errormessage = e(res, 'message') || 'Keine Daten verfügbar';
        return;
      }

      this.event = res.event;
    });
    this.subs.push(sub);
  }
}


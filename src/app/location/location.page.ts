import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
import { StreamService } from '../services/stream/stream.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit, OnDestroy {
  public id;
  public server;
  public moment = moment;
  public location;
  public isLoading = false;
  public errormessage: string;
  private subs: Subscription[] = [];

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
    this.getLocation(this.auth.data.user_id, this.id);
  }

  /**
   * On destroy hook
   */
  public ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  /**
   * Reload the locations
   * @param event
   * @return {Promise<void>}
   */
  public async reload(event) {
    event.target.complete();
    this.getLocation(this.auth.data.user_id, this.id);
  }

  /**
   * Get a single location.
   * @param {number} userId
   * @param {number} id
   */
  private getLocation(userId: number, id: number) {
    this.isLoading = true;
    this.errormessage = '';
    const sub = this.stream.getLocationByUser(userId, id).subscribe((res: any) => {
      console.log(location);
      this.isLoading = false;
      if (!res['success']) {
        this.errormessage = res['message'] || 'Keine Daten verfügbar';
        return;
      }
      console.log(res);
      this.location = res.location;
    });
    this.subs.push(sub);
  }

}

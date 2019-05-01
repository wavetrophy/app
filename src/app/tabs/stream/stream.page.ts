import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StreamService } from '../../services/stream/stream.service';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
})
/**
 * Class Streampage
 */
export class StreamPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  /**
   * Error message
   * @type {string|null}
   */
  public errormessage = null;

  /**
   * @type {Array|null}
   */
  public locations = [];

  /**
   * @type {Subscription[]}
   */
  public subs: Subscription[] = [];

  /**
   * @type {boolean}
   */
  public isLoading = false;

  /**
   * StreamPage constructor.
   * @param {AuthService} auth
   * @param {StreamService} stream
   */
  constructor(
    private auth: AuthService,
    private stream: StreamService,
  ) {
  }

  /**
   * On init hook
   * @returns {Promise<void>}
   */
  public ngOnInit() {
    this.getStream();
  }

  /**
   * Get the stream
   * @returns {Promise<void>}
   */
  public getStream() {
    this.isLoading = true;

    const userId = this.auth.data.user_id;
    const sub = this.stream.getByUser(userId).subscribe((res: any) => {
      this.isLoading = false;
      if (!res['success']) {
        this.errormessage = res['message'] || 'Keine Daten verfügbar';
        return;
      }
      console.log(res);
      this.locations = res.locations;
    }, (res: any) => {
      this.isLoading = false;
      this.errormessage = res['message'] || 'Es ist ein Fehler aufgetreten';
    });
    this.subs.push(sub);
  }
}

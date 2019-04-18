import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StreamService } from '../../services/stream/stream.service';
import { IonInfiniteScroll } from '@ionic/angular';

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
  public async ngOnInit() {
    await this.getStream();
  }

  /**
   * Get the stream
   * @returns {Promise<void>}
   */
  public async getStream() {
    this.isLoading = true;

    const userId = this.auth.data.user_id;
    this.stream.getByUser(userId).subscribe((res: any) => {
      this.isLoading = false;
      if (!res['success']) {
        this.errormessage = res['message'];
        return;
      }
      console.log(res);
      this.locations = res.locations;
    }, (res: any) => {
      this.isLoading = false;
      this.errormessage = res['message'] || 'Es ist ein Fehler aufgetreten';
    });
  }
}

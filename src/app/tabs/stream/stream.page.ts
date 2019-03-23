import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StreamService } from '../../services/stream/stream.service';
import { IonInfiniteScroll, LoadingController } from '@ionic/angular';

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
   *
   * @type {Array|null}
   */
  public locations = [];

  /**
   * StreamPage constructor.
   * @param {AuthService} auth
   * @param {StreamService} stream
   * @param {LoadingController} loading
   */
  constructor(
    private auth: AuthService,
    private stream: StreamService,
    private loading: LoadingController,
  ) {
  }

  /**
   * On init hook
   * @returns {Promise<void>}
   */
  async ngOnInit() {
    const loader = await this.loading.create({
      message: 'Loading',
      spinner: 'crescent',
    });
    loader.present();

    const userId = this.auth.user.user_id;
    this.stream.getByUser(userId).subscribe((res: any) => {
      if (!res['success']) {
        this.errormessage = res['message'];
        return;
      }
      console.log(res);
      this.locations = res.locations;
      loader.dismiss();
    });
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.locations.length >= 1000) {
        event.target.disabled = true;
      }
    }, 500);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}

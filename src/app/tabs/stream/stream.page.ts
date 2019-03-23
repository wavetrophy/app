import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StreamService } from '../../services/stream/stream.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
})
/**
 * Class Streampage
 */
export class StreamPage implements OnInit {
  /**
   * Error message
   * @type {string|null}
   */
  public errormessage = null;

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
      }
      console.log(res);
      loader.dismiss();
    });
  }

}

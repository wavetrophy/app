import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { StreamService } from '../../services/stream/stream.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
})
export class StreamPage implements OnInit {

  constructor(
    private auth: AuthService,
    private stream: StreamService,
  ) {
  }

  ngOnInit() {
    const waveId = this.auth.user.current_wave;
    this.stream.getLocationsByWave(waveId).subscribe(res => {
      console.log(res);
    });
  }

}

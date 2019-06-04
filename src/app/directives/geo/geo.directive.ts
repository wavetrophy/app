import { Directive, HostListener, Input, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { LaunchNavigator } from '@ionic-native/launch-navigator/ngx';

@Directive({
  selector: '[geo]',
})
export class GeoDirective implements OnInit {
  @Input()
  public geo?: string = null;

  @Input()
  @HostListener('click')
  public click() {
    this.launcher.navigate(this.geo);
  }

  constructor(
    private platform: Platform,
    private launcher: LaunchNavigator,
  ) {
  }

  public ngOnInit() {
  }
}

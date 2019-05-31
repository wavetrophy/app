import { Directive, HostBinding, Input, OnInit } from '@angular/core';
import { NetworkService } from '../../services/network/network.service';
import { NetworkStatus } from '../../services/network/network-status';
import { ConsoleColor, ConsoleLogger } from '../../services/logger/logger';

const logger = new ConsoleLogger('REQ-CON', ConsoleColor.GREEN);

@Directive({
  selector: '[requires-connection]',
})
export class RequiresConnectionDirective implements OnInit {
  @Input()
  @HostBinding('attr.disabled')
  public offline = false;

  /**
   * Constructor
   * @param {NetworkService} network
   */
  constructor(
    private network: NetworkService,
  ) {
  }

  /**
   * Setup directive
   */
  public ngOnInit(): void {
    this.network.onNetworkChange().subscribe((status) => {
      logger.log('Status: ', status);
      switch (status) {
        case NetworkStatus.OFFLINE:
          this.offline = true;
          break;
        case NetworkStatus.ONLINE:
          this.offline = false;
          break;
        default:
          this.offline = false;
          break;
      }
    });
  }
}

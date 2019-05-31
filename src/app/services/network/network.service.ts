import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { ConsoleColor, ConsoleLogger } from '../logger/logger';
import { NetworkStatus } from './network-status';

const logger = new ConsoleLogger('NETWORK', ConsoleColor.GRAY);

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private status: BehaviorSubject<NetworkStatus> = new BehaviorSubject(NetworkStatus.ONLINE);

  /**
   * Constructor
   * @param {Network} network
   * @param {Platform} platform
   */
  public constructor(
    private network: Network,
    private platform: Platform,
  ) {
    const onlineStatus = [
      this.network.Connection.CELL,
      this.network.Connection.CELL_2G,
      this.network.Connection.CELL_3G,
      this.network.Connection.CELL_4G,
      this.network.Connection.ETHERNET,
      this.network.Connection.WIFI,
    ];
    if (this.platform.is('cordova')) {
      this.network.onConnect().subscribe((connection) => {
        if (connection.type === NetworkStatus.ONLINE) {
          this.updateNetworkStatus(NetworkStatus.ONLINE);
        } else {
          this.updateNetworkStatus(NetworkStatus.OFFLINE);
        }
      });
      this.network.onDisconnect().subscribe(() => {
        if (this.status.getValue() === NetworkStatus.OFFLINE) {
          this.updateNetworkStatus(NetworkStatus.ONLINE);
        }
      });
      if (onlineStatus.includes(this.network.type)) {
        this.updateNetworkStatus(NetworkStatus.ONLINE);
      } else {
        this.updateNetworkStatus(NetworkStatus.OFFLINE);
      }
    } else {
      if (navigator && 'onLine' in navigator) {
        if (!navigator.onLine) {
          this.updateNetworkStatus(NetworkStatus.OFFLINE);
        }

        window.addEventListener('online', () => {
          this.updateNetworkStatus(NetworkStatus.ONLINE);
        });
        window.addEventListener('offline', () => {
          this.updateNetworkStatus(NetworkStatus.OFFLINE);
        });
      }
    }
  }

  /**
   * Update network status
   * @param {NetworkStatus} status
   */
  private updateNetworkStatus(status: NetworkStatus) {
    logger.log(status);
    this.status.next(status);
  }

  /**
   * Get network status observable
   * @return {Observable<NetworkStatus>}
   */
  public onNetworkChange(): Observable<NetworkStatus> {
    return this.status.asObservable();
  }

  /**
   * Get current network status
   * @return {NetworkStatus}
   */
  public currentNetworkStatus(): NetworkStatus {
    return this.status.getValue();
  }
}

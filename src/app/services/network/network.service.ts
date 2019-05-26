import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@ionic-native/network/ngx';
import { Platform } from '@ionic/angular';
import { ConsoleColor, ConsoleLogger } from '../logger/logger';

const logger = new ConsoleLogger('NETWORK', ConsoleColor.GRAY);

export enum NetworkStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
}

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
  constructor(
    private network: Network,
    private platform: Platform,
  ) {
    if (this.platform.is('cordova')) {
      this.network.onConnect().subscribe(() => {
        if (this.status.getValue() === NetworkStatus.ONLINE) {
          this.updateNetworkStatus(NetworkStatus.OFFLINE);
        }
      });
      this.network.onDisconnect().subscribe(() => {
        if (this.status.getValue() === NetworkStatus.OFFLINE) {
          this.updateNetworkStatus(NetworkStatus.ONLINE);
        }
      });
      if (this.network.Connection.NONE) {
        this.updateNetworkStatus(NetworkStatus.OFFLINE);
      }
    }

    if (this.platform.is('desktop')) {
      if (!navigator.onLine) {
        this.updateNetworkStatus(NetworkStatus.OFFLINE);
      }

      window.addEventListener('online', () => this.updateNetworkStatus(NetworkStatus.ONLINE));
      window.addEventListener('offline', () => this.updateNetworkStatus(NetworkStatus.OFFLINE));
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

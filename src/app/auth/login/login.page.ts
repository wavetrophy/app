import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/firebase/cloud-messaging/notification.service';
import { __ } from '../../services/functions';
import { RegisterPage } from '../../modal/auth/register/register.page';
import { NetworkService } from '../../services/network/network.service';
import { NetworkStatus } from '../../services/network/network-status';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
/**
 * Class LoginPage
 */
export class LoginPage implements OnInit {
  /**
   * The login form
   * @type {FormGroup}
   */
  public form: FormGroup;

  /**
   * Indicates if the page is loading.
   * @type {boolean}
   */
  public isLoading = false;

  /**
   * LoginPage constructor.
   */
  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private loading: LoadingController,
    private router: Router,
    private notifications: NotificationService,
    private nav: NavController,
    private modal: ModalController,
    private network: NetworkService,
    private alert: AlertController,
  ) {
  }

  /**
   * On Init hook.
   */
  public ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Login
   */
  public async login() {
    if (this.network.currentNetworkStatus() === NetworkStatus.OFFLINE) {
      const alert = await this.alert.create({
        header: __('Offline'),
        message: __('Du bist offline. Bitte gehe wieder online um dich anmelden zu können'),
        buttons: [{
          text: __('OK'),
          role: 'dismiss',
        }],
      });
      alert.present();
      return;
    }

    const loader = await this.loading.create({
      message: __('Laden'),
      spinner: 'crescent',
    });
    loader.present();
    this.isLoading = true;

    this.auth.login(this.form.value)
      .subscribe(() => {
        this.isLoading = false;
        this.notifications.register();
        this.nav.navigateRoot(['/', 'wave']).then(() => loader.dismiss());
      }, () => {
        this.isLoading = false;
        loader.dismiss();
      });
  }

  /**
   *
   * @return {Promise<void>}
   */
  public async openRegistration() {
    RegisterPage.asModal(this.modal);
  }
}

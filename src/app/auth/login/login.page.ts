import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/firebase/cloud-messaging/notification.service';
import { __ } from '../../services/functions';

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
}

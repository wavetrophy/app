import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
/**
 * Class LoginPage
 */
export class LoginPage implements OnInit {
  public form: FormGroup;
  private isLoading: boolean = false;

  /**
   * LoginPage constructor.
   */
  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private loading: LoadingController,
  ) {
  }

  /**
   * On Init hook.
   */
  public ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  /**
   * Login
   */
  public async login() {
    const loader = await this.loading.create({
      message: 'Logging in',
      spinner: 'crescent',
    });
    loader.present();
    this.isLoading = true;

    this.auth.login(this.form.value).subscribe(() => {
      this.isLoading = false;
      loader.dismiss();
    });
  }
}

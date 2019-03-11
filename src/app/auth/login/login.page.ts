import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  /**
   * LoginPage constructor.
   */
  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
  ) {
  }

  /**
   * On Init hook.
   */
  public ngOnInit() {
    this.form = this.formBuilder.group({
      username: ['', Validators.email],
      password: [''],
    });
  }

  /**
   * Login
   */
  public login() {
    this.auth.login(this.form.value).subscribe(response => console.log(response));
  }
}

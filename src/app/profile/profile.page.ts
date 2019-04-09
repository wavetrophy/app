import { Component, OnInit } from '@angular/core';
import { Email } from '../services/user/types/email';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';
import { ModalController } from '@ionic/angular';
import { EmailPage } from '../modal/edit/email/email.page';
import { UsernamePage } from '../modal/edit/username/username.page';

@Component({
  selector: 'profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  public emails: Email[];

  /**
   * Constructor
   */
  public constructor(
    private userService: UserService,
    private auth: AuthService,
    private modal: ModalController,
  ) {
  }

  /**
   * On init hook.
   */
  ngOnInit() {
    this.userService.getEmails(this.auth.data.user_id).subscribe((emails: Email[]) => {
      this.emails = emails;
    });
    // todo add profile picture upload from gallery
  }

  async editUsername() {
    UsernamePage.asModal(this.modal, 'USERNAME', this.saveUsername);
  }

  async edit(email: Email) {
    EmailPage.asModal(this.modal, email.email, this.saveEmail);
  }

  private saveEmail(email: string): Promise<boolean> {
    return new Promise(resolve => setTimeout(() => resolve(true), 3000));
  }

  private saveUsername() {
    return new Promise(resolve => setTimeout(() => resolve(true), 3000));
  }
}

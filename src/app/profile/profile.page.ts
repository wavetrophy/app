import { Component, OnInit } from '@angular/core';
import { Email } from '../services/user/types/email';
import { UserService } from '../services/user/user.service';
import { AuthService } from '../services/auth/auth.service';

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
  public constructor(private userService: UserService, private auth: AuthService) {
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
}

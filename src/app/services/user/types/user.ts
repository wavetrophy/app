import { Email } from './email';
import { Phonenumber } from './phonenumber';
import { Team } from './team';
import { ProfilePicture } from './profile-picture';

export interface User {
  id: number;
  username: string;
  enabled: boolean;
  first_name: string;
  last_name: string;
  profile_picture: ProfilePicture;
  has_received_welcome_email: boolean;
  has_received_setup_app_email: boolean;
  must_reset_password: boolean;
  team: Team;
  emails: Email[];
  phonenumbers: Phonenumber[];
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  deleted_at: Date;
}

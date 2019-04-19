import { Email } from '../user/types/email';
import { Phonenumber } from '../user/types/phonenumber';

export interface Team {
  id: number;
  name: string;
  start_number: number;
}

export interface Group {
  id: number;
  name: string;
}

export interface Contact {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture?: any;
  team: Team;
  group: Group;
  emails: Email[];
  phonenumbers: Phonenumber[];
}

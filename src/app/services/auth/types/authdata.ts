import { Wave } from '../../wave/types/wave';

export interface AuthData {
  current_wave: Wave;
  locale: {
    short: string,
    long: string,
  };
  exp: number;
  iat: number;
  group_id: number;
  ip: string;
  roles: string[];
  team_id: number;
  user_id: number;
  username: string;
  profile_picture: string;
  must_reset_password: boolean;
}

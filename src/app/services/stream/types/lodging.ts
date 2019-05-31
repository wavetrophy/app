import { User } from '../../user/types/user';

export interface Lodging {
  id: number;
  comment: string;
  users: User[];
}

import { User } from '../../user/types/user';

export interface Question {
  id: number;
  title: string;
  question: string;
  resolved: boolean;
  group?: any;
  user: User;
  answers: any[];
}

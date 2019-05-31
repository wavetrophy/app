import { User } from '../../user/types/user';
import { Answer } from './answer';

export interface Question {
  id: number;
  title: string;
  question: string;
  resolved: boolean;
  group?: any;
  user: User;
  answers: Answer[];
  asked_at: string;
}

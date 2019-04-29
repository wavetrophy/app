export interface Question {
  id: number;
  title: string;
  question: string;
  group: string;
  user: string;
  resolved: boolean;
  answers: string[];
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  deleted_at: Date;
  deleted: boolean;
}

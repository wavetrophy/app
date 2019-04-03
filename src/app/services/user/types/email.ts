export interface Email {
  id: number;
  email: string;
  is_public: boolean;
  confirmed: boolean;
  user: string;
}

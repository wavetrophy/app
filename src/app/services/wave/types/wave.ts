export interface Wave {
  id: number;
  name: string;
  country: string;
  start: Date;
  end: Date;
  groups: string[];
  locations: string[];
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
  deleted_at: Date;
  deleted: boolean;
}

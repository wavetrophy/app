import { Lodging } from './lodging';

export interface Hotel {
  id: number;
  name: string;
  thumbnail?: any;
  lat: string;
  lon: string;
  location: string;
  check_in: Date;
  check_out: Date;
  personal_lodging: Lodging,
  lodgings: Lodging[];
}

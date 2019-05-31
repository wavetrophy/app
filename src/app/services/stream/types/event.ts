import { Activity } from './activity';

export interface Event {
  id: number;
  name: string;
  start: Date;
  end: Date;
  lat: string;
  lon: string;
  location: string;
  thumbnail?: any;
  activities: Activity[];
  personal_participation: {
    id: number;
    arrival: Date;
    departure: Date;
    teams: {
      id: number;
      name: string;
      start_number: number;
    }[];
  };
  participations: {
    id: number;
    arrival: Date;
    departure: Date;
    teams: {
      id: number;
      name: string;
      start_number: number;
    }[];
  }[];
}

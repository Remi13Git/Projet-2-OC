import { Participation } from './participation.interface';

export interface Country {
  id: number;
  country: string;
  participations: Participation[];
}

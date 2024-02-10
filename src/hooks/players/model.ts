import { Division } from 'data/constants';

export interface FormPlayer {
  id?: number;
  firstName: string;
  lastName: string;
  division: Division;
  handicap: number;
}

export interface Player {
  id: number;
  lastName: string;
  firstName: string;
  fullName: string;
  division: Division;
  handicap: number;
}

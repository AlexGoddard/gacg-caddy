import { ScoreType } from 'data/constants';

export interface Deuce {
  player: string;
  holeNumber: number;
}

export interface Payball {
  player: string;
  holeNumber: number;
  score: number;
}

export interface Payballs {
  scoreType: ScoreType;
  payballs: Payball[];
}

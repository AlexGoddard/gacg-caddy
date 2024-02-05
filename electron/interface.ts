import { ScoreType } from './constants';

export interface CalcuttaTeam {
  a: CalcuttaPlayerData;
  b: CalcuttaPlayerData;
  gross?: number[];
  net?: number[];
}

export interface Payballs {
  scoreType: ScoreType;
  payballs: Payball[];
}

export interface Round {
  playerId: number;
  day: string;
  grossHoles: number[];
}

interface CalcuttaPlayerData {
  id: number;
  name: string;
  gross?: number[];
  net?: number[];
}

interface Payball {
  player: string;
  hole: number;
  score: number;
}

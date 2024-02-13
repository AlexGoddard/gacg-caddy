import { TournamentDay } from 'data/constants';

import { Division, ScoreType } from './constants';

export interface CalcuttaTeam {
  a: PlayerInfo;
  b: PlayerInfo;
  gross: number;
  net: number;
}

export interface CalcuttaTeamHoles {
  a: number[];
  b: number[];
  team: number[];
}

export interface FormPlayer {
  id?: number;
  firstName: string;
  lastName: string;
  division: Division;
  handicap: number;
}

export interface Payballs {
  scoreType: ScoreType;
  payballs: Payball[];
}

export interface Round {
  playerId: number;
  day: TournamentDay;
  grossHoles: number[];
}

export interface EditedRound extends Round {
  previousDay: TournamentDay;
}

interface PlayerInfo {
  id: number;
  name: string;
}

interface Payball {
  player: string;
  hole: number;
  score: number;
}

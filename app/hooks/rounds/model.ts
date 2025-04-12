import { TournamentDay } from 'data/constants';

export interface EditedRound extends Round {
  previousDay: TournamentDay;
}

export interface PlayerInfo {
  id: number;
  name: string;
}

export interface PlayerRound {
  player: PlayerInfo;
  gross: number;
  net: number;
}

export interface PlayerScores {
  day: TournamentDay;
  scores: number[];
}

export interface Round {
  playerId: number;
  day: TournamentDay;
  grossHoles: number[];
}

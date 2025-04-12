import { PlayerInfo } from 'hooks/rounds/model';

export interface CalcuttaTeam {
  aPlayerId: number;
  bPlayerId: number;
}

export interface CalcuttaTeamHoles {
  a: number[];
  b: number[];
  team: number[];
}

export interface CalcuttaTeamRound {
  a: PlayerInfo;
  b: PlayerInfo;
  gross: number;
  net: number;
}

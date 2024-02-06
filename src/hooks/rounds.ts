import { useQuery } from '@tanstack/react-query';

import { ScoreType, TournamentDay } from 'components/constants';
import { get, post } from 'util/network';

export interface CalcuttaPlayerInfo {
  id: number;
  name: string;
}

export interface CalcuttaTeam {
  a: CalcuttaPlayerInfo;
  b: CalcuttaPlayerInfo;
  gross: number;
  net: number;
}

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

export interface Round {
  playerId: number;
  day: string;
  grossHoles: number[];
}

interface CalcuttaTeamHoles {
  a: number[];
  b: number[];
  team: number[];
}

export const saveRound = (newRound: Round): Promise<boolean> =>
  post('/rounds', { round: newRound }).then((response) => response);

export const useCalcuttaQuery = (day: TournamentDay) => {
  return {
    queryKey: ['calcutta', day],
    queryFn: () => fetchCalcutta(day),
  };
};

export const useCalcutta = (day: TournamentDay) => useQuery(useCalcuttaQuery(day));

export const useCalcuttaSampleQuery = (isEnabled: boolean) => {
  return {
    queryKey: ['calcutta/sample'],
    queryFn: fetchCalcuttaSample,
    enabled: isEnabled,
  };
};

export const useCalcuttaSample = (isEnabled: boolean) =>
  useQuery(useCalcuttaSampleQuery(isEnabled));

export const useCalcuttaTeamHolesQuery = (
  day: TournamentDay,
  scoreType: ScoreType,
  aPlayerId: number,
  bPlayerId: number,
) => {
  return {
    queryKey: ['calcutta/teams/holes', day, scoreType, aPlayerId, bPlayerId],
    queryFn: () => fetchCalcuttaTeamHoles(day, scoreType, aPlayerId, bPlayerId),
  };
};

export const useCalcuttaTeamHoles = (
  day: TournamentDay,
  scoreType: ScoreType,
  aPlayerId: number,
  bPlayerId: number,
) => useQuery(useCalcuttaTeamHolesQuery(day, scoreType, aPlayerId, bPlayerId));

export const useDeuces = (day: TournamentDay) =>
  useQuery({ queryKey: ['deuces', day], queryFn: () => fetchDeuces(day) });

export const usePayballs = (day: TournamentDay) =>
  useQuery({ queryKey: ['payballs', day], queryFn: () => fetchPayballs(day) });

function fetchCalcutta(day: TournamentDay): Promise<CalcuttaTeam[]> {
  return get('/calcutta', { day: day }).then((calcutta) => calcutta);
}

function fetchCalcuttaSample(): Promise<(string | number)[][]> {
  return get('/calcutta/sample').then((calcuttaSample) => calcuttaSample);
}

function fetchCalcuttaTeamHoles(
  day: TournamentDay,
  scoreType: ScoreType,
  aPlayerId: number,
  bPlayerId: number,
): Promise<CalcuttaTeamHoles> {
  return get('/calcutta/teams/holes', {
    day: day,
    scoreType: scoreType,
    aPlayerId: aPlayerId,
    bPlayerId: bPlayerId,
  }).then((teamHoles) => teamHoles);
}

function fetchDeuces(day: TournamentDay): Promise<Deuce[]> {
  return get('/deuces', { day: day }).then((deuces) => deuces);
}

function fetchPayballs(day: TournamentDay): Promise<Payballs[]> {
  return get('/payballs', { day: day }).then((payballs) => payballs);
}

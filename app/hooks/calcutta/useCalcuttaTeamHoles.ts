import { useQuery } from '@tanstack/react-query';

import { ScoreType, TournamentDay } from 'data/constants';
import { get } from 'utils/network';

import { CalcuttaTeamHoles } from './model';

export const CALCUTTA_TEAM_HOLES_PATH = 'calcutta/teams/holes';

export const useCalcuttaTeamHolesQuery = (
  day: TournamentDay,
  scoreType: ScoreType,
  aPlayerId: number,
  bPlayerId: number,
) => ({
  queryKey: [CALCUTTA_TEAM_HOLES_PATH, day, scoreType, aPlayerId, bPlayerId],
  queryFn: () => fetchCalcuttaTeamHoles(day, scoreType, aPlayerId, bPlayerId),
});

export const useCalcuttaTeamHoles = (
  day: TournamentDay,
  scoreType: ScoreType,
  aPlayerId: number,
  bPlayerId: number,
) => useQuery(useCalcuttaTeamHolesQuery(day, scoreType, aPlayerId, bPlayerId));

function fetchCalcuttaTeamHoles(
  day: TournamentDay,
  scoreType: ScoreType,
  aPlayerId: number,
  bPlayerId: number,
): Promise<CalcuttaTeamHoles> {
  return get(`/${CALCUTTA_TEAM_HOLES_PATH}`, {
    day: day,
    scoreType: scoreType,
    aPlayerId: aPlayerId,
    bPlayerId: bPlayerId,
  }).then((teamHoles) => teamHoles);
}

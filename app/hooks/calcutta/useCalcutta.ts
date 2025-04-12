import { useQuery } from '@tanstack/react-query';

import { TournamentDay } from 'data/constants';
import { get } from 'utils/network';

import { CalcuttaTeamRound } from './model';

export const CALCUTTA_PATH = 'calcutta';

export const useCalcuttaQuery = (day: TournamentDay) => ({
  queryKey: [CALCUTTA_PATH, day],
  queryFn: () => fetchCalcutta(day),
});

export const useCalcutta = (day: TournamentDay) =>
  useQuery(useCalcuttaQuery(day));

function fetchCalcutta(day: TournamentDay): Promise<CalcuttaTeamRound[]> {
  return get(`/${CALCUTTA_PATH}`, { day: day }).then((calcutta) => calcutta);
}

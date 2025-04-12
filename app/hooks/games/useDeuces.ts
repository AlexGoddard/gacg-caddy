import { useQuery } from '@tanstack/react-query';

import { TournamentDay } from 'data/constants';
import { get } from 'utils/network';

import { Deuce } from './model';

export const DEUCES_PATH = 'games/deuces';

export const useDeuces = (day: TournamentDay) =>
  useQuery({ queryKey: [DEUCES_PATH, day], queryFn: () => fetchDeuces(day) });

function fetchDeuces(day: TournamentDay): Promise<Deuce[]> {
  return get(`/${DEUCES_PATH}`, { day: day }).then((deuces) => deuces);
}

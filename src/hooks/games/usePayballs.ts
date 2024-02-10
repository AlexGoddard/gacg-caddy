import { useQuery } from '@tanstack/react-query';

import { TournamentDay } from 'data/constants';
import { get } from 'utils/network';

import { Payballs } from 'hooks/games/model';

export const PAYBALLS_PATH = 'games/payballs';

export const usePayballs = (day: TournamentDay) =>
  useQuery({ queryKey: [PAYBALLS_PATH, day], queryFn: () => fetchPayballs(day) });

function fetchPayballs(day: TournamentDay): Promise<Payballs[]> {
  return get(`/${PAYBALLS_PATH}`, { day: day }).then((payballs) => payballs);
}

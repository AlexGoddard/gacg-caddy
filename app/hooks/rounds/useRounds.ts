import { useQuery } from '@tanstack/react-query';

import { TournamentDay } from 'data/constants';
import { get } from 'utils/network';

import { PlayerRound } from './model';

export const ROUNDS_PATH = 'rounds';

export const useRounds = (day: TournamentDay, playerId?: number) =>
  useQuery({
    queryKey: [ROUNDS_PATH, day, playerId],
    queryFn: () => fetchRounds(day, playerId),
  });

function fetchRounds(
  day: TournamentDay,
  playerId?: number,
): Promise<PlayerRound[]> {
  return get(`/${ROUNDS_PATH}`, { day: day, playerId: playerId }).then(
    (rounds) => rounds,
  );
}

import { useQuery } from '@tanstack/react-query';

import { get } from 'utils/network';

import { Player } from './model';

export const PLAYERS_PATH = 'players';

export const usePlayersQuery = {
  queryKey: [PLAYERS_PATH],
  queryFn: fetchPlayers,
};

export const usePlayers = () => useQuery(usePlayersQuery);

function fetchPlayers(): Promise<Player[]> {
  return get(`/${PLAYERS_PATH}`).then((players) => players);
}

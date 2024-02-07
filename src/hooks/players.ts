import { useQuery } from '@tanstack/react-query';

import { Division } from 'components/constants';

import { del, get, post } from 'util/network';

export interface NewPlayer {
  firstName: string;
  lastName: string;
  division: Division;
  handicap: number;
}

export interface Player {
  id: number;
  lastName: string;
  firstName: string;
  fullName: string;
  division: Division;
  handicap: number;
}

export const deletePlayers = (playerIds: number[]): Promise<boolean> =>
  del('/players', { playerIds: playerIds }).then((response) => response);

export const savePlayer = (newPlayer: NewPlayer): Promise<Player> =>
  post('/players', { player: newPlayer }).then((response) => response);

export const usePlayersQuery = { queryKey: ['players'], queryFn: fetchPlayers };

export const usePlayers = () => useQuery(usePlayersQuery);

function fetchPlayers(): Promise<Player[]> {
  return get('/players').then((players) => players);
}

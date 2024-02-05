import { useQuery } from '@tanstack/react-query';

import { get } from 'util/network';

export interface Player {
  id: number;
  lastName: string;
  firstName: string;
  fullName: string;
  division: string;
  handicap: number;
}

const fetchPlayers = (): Promise<Player[]> => get('/players').then((players) => players);

export const usePlayersQuery = { queryKey: ['players'], queryFn: fetchPlayers };

export const usePlayers = () => useQuery(usePlayersQuery);

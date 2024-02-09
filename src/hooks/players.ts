import { useQuery } from '@tanstack/react-query';

import { Division } from 'components/constants';

import { del, get, post, put } from 'util/network';

export interface FormPlayer {
  id?: number;
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

export const createCalcuttaTeam = (aPlayerId: number, bPlayerId: number): Promise<boolean> =>
  post('/calcutta/teams', { aPlayerId: aPlayerId, bPlayerId: bPlayerId }).then(
    (response) => response,
  );

export const deleteCalcuttaTeam = (playerId: number): Promise<boolean> =>
  del('/calcutta/teams', { playerId: playerId }).then((response) => response);

export const deletePlayer = (playerId: number): Promise<boolean> =>
  del('/players', { playerId: playerId }).then((response) => response);

export const updatePlayer = (updatedPlayer: FormPlayer): Promise<Player> =>
  put('/players', { player: updatedPlayer }).then((response) => response);

export const createPlayer = (newPlayer: FormPlayer): Promise<Player> =>
  post('/players', { player: newPlayer }).then((response) => response);

export const useAvailablePartners = (division: Division) =>
  useQuery({
    queryKey: ['calcutta/players/available', division],
    queryFn: () => fetchAvailablePartners(division),
  });

export const useCalcuttaPartner = (playerId: number) =>
  useQuery({
    queryKey: ['calcutta/teams/partner', playerId],
    queryFn: () => fetchCalcuttaPartner(playerId),
  });

export const usePlayersQuery = { queryKey: ['players'], queryFn: fetchPlayers };

export const usePlayers = () => useQuery(usePlayersQuery);

function fetchAvailablePartners(division: Division): Promise<Player[]> {
  return get('/calcutta/players/available', { division: division }).then((players) => players);
}

function fetchCalcuttaPartner(playerId: number): Promise<Player> {
  return get('/calcutta/teams/partner', { playerId: playerId }).then((player) => player);
}

function fetchPlayers(): Promise<Player[]> {
  return get('/players').then((players) => players);
}

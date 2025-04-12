import { useQuery } from '@tanstack/react-query';

import { get } from 'utils/network';

import { Player } from './model';

export const PARTNER_PATH = 'players/partner';

export const usePartner = (playerId: number) =>
  useQuery({
    queryKey: [PARTNER_PATH, playerId],
    queryFn: () => fetchPartner(playerId),
  });

function fetchPartner(playerId: number): Promise<Player> {
  return get(`/${PARTNER_PATH}`, { playerId: playerId }).then(
    (player) => player,
  );
}

import { useQuery } from '@tanstack/react-query';

import { Division } from 'data/constants';
import { get } from 'utils/network';

import { Player } from './model';

export const AVAILABLE_PLAYERS_PATH = 'players/available';

export const useAvailablePlayers = (division: Division) =>
  useQuery({
    queryKey: [AVAILABLE_PLAYERS_PATH, division],
    queryFn: () => fetchAvailablePartners(division),
  });

function fetchAvailablePartners(division: Division): Promise<Player[]> {
  return get(`/${AVAILABLE_PLAYERS_PATH}`, { division: division }).then((players) => players);
}

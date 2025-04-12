import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from 'utils/network';

import { FormPlayer, Player } from './model';
import { AVAILABLE_PLAYERS_PATH } from './useAvailablePlayers';
import { PLAYERS_PATH } from './usePlayers';

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newPlayer: FormPlayer) => createPlayer(newPlayer),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [PLAYERS_PATH] });
      queryClient.invalidateQueries({ queryKey: [AVAILABLE_PLAYERS_PATH] });
    },
  });
};

function createPlayer(newPlayer: FormPlayer): Promise<Player> {
  return post(`/${PLAYERS_PATH}`, { player: newPlayer }).then((response) => response);
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from 'utils/network';

import { FormPlayer, Player } from 'hooks/players/model';
import { AVAILABLE_PLAYERS_PATH } from 'hooks/players/useAvailablePlayers';
import { PLAYERS_PATH } from 'hooks/players/usePlayers';

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

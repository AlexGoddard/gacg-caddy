import { useMutation, useQueryClient } from '@tanstack/react-query';

import { put } from 'utils/network';

import { FormPlayer, Player } from './model';
import { PLAYERS_PATH } from './usePlayers';

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (editedPlayer: FormPlayer) => updatePlayer(editedPlayer),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [PLAYERS_PATH] }),
  });
};

function updatePlayer(editedPlayer: FormPlayer): Promise<Player> {
  return put(`/${PLAYERS_PATH}`, { player: editedPlayer }).then((response) => response);
}

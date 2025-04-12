import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from 'utils/network';

import { PLAYERS_PATH } from './usePlayers';

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: number) => deletePlayer(playerId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: [PLAYERS_PATH] }),
  });
};

function deletePlayer(playerId: number): Promise<boolean> {
  return del(`/${PLAYERS_PATH}`, { playerId: playerId }).then((response) => response);
}

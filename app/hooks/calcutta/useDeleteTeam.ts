import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from 'utils/network';

import { PARTNER_PATH } from 'hooks/players/usePartner';

import { CALCUTTA_TEAMS_PATH } from './useCreateTeam';

export const useDeleteTeam = (initiatingPlayerId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: number) => deleteCalcuttaTeam(playerId),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [PARTNER_PATH, initiatingPlayerId],
      }),
  });
};

function deleteCalcuttaTeam(playerId: number): Promise<boolean> {
  return del(`/${CALCUTTA_TEAMS_PATH}`, { playerId: playerId }).then(
    (response) => response,
  );
}

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { del } from 'utils/network';

import { CALCUTTA_TEAMS_PATH } from 'hooks/calcutta/useCreateTeam';
import { PARTNER_PATH } from 'hooks/players/usePartner';

export const useDeleteTeam = (initiatingPlayerId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: number) => deleteCalcuttaTeam(playerId),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [PARTNER_PATH, initiatingPlayerId] }),
  });
};

function deleteCalcuttaTeam(playerId: number): Promise<boolean> {
  return del(`/${CALCUTTA_TEAMS_PATH}`, { playerId: playerId }).then((response) => response);
}

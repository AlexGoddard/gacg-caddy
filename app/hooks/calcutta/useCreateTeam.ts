import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from 'utils/network';

import { PARTNER_PATH } from 'hooks/players/usePartner';

import { CalcuttaTeam } from './model';

export const CALCUTTA_TEAMS_PATH = 'calcutta/teams';

export const useCreateTeam = (initiatingPlayerId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newCalcuttaTeam: { aPlayerId: number; bPlayerId: number }) =>
      createCalcuttaTeam(newCalcuttaTeam.aPlayerId, newCalcuttaTeam.bPlayerId),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: [PARTNER_PATH, initiatingPlayerId],
      }),
  });
};

function createCalcuttaTeam(
  aPlayerId: number,
  bPlayerId: number,
): Promise<CalcuttaTeam> {
  return post(`/${CALCUTTA_TEAMS_PATH}`, {
    aPlayerId: aPlayerId,
    bPlayerId: bPlayerId,
  }).then((response) => response);
}

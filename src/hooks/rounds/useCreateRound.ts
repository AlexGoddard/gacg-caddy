import { useMutation, useQueryClient } from '@tanstack/react-query';

import { post } from 'utils/network';

import { Round } from 'hooks/rounds/model';
import { ROUNDS_PATH } from 'hooks/rounds/useRounds';
import { SCORES_PATH } from 'hooks/rounds/useScores';

export const useCreateRound = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newRound: Round) => createRound(newRound),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [ROUNDS_PATH] });
      queryClient.invalidateQueries({ queryKey: [SCORES_PATH] });
    },
  });
};

function createRound(newRound: Round): Promise<boolean> {
  return post(`/${ROUNDS_PATH}`, { round: newRound }).then((response) => response);
}

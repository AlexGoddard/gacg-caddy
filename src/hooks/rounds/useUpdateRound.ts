import { useMutation, useQueryClient } from '@tanstack/react-query';

import { put } from 'utils/network';

import { EditedRound, Round } from 'hooks/rounds/model';
import { ROUNDS_PATH } from 'hooks/rounds/useRounds';
import { SCORES_PATH } from 'hooks/rounds/useScores';

export const useUpdateRound = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (editedRound: EditedRound) => updateRound(editedRound),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [ROUNDS_PATH] });
      queryClient.invalidateQueries({ queryKey: [SCORES_PATH] });
    },
  });
};

function updateRound(editedRound: EditedRound): Promise<Round> {
  return put(`/${ROUNDS_PATH}`, { round: editedRound }).then((response) => response);
}

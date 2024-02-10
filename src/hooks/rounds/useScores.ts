import { useQuery } from '@tanstack/react-query';

import { ScoreType, TournamentDay } from 'data/constants';
import { get } from 'utils/network';

import { PlayerScores } from 'hooks/rounds/model';

export const SCORES_PATH = 'scores';

export const useScores = (day: TournamentDay, scoreType: ScoreType, playerId: number) =>
  useQuery({
    queryKey: [SCORES_PATH, day, scoreType, playerId],
    queryFn: () => fetchScores(day, scoreType, playerId),
  });

function fetchScores(
  day: TournamentDay,
  scoreType: ScoreType,
  playerId: number,
): Promise<PlayerScores[]> {
  return get(`/${SCORES_PATH}`, { day: day, scoreType: scoreType, playerId: playerId }).then(
    (scores) => scores,
  );
}

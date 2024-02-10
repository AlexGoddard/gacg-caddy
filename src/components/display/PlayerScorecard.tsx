import { TableProps } from '@mantine/core';

import { Scorecard } from 'components/display/Scorecard';

import { PLACEHOLDER_SCORES, ScoreType, TournamentDay } from 'data/constants';

import { PlayerInfo } from 'hooks/rounds/model';
import { useScores } from 'hooks/rounds/useScores';

export interface PlayerScorecardData {
  day: TournamentDay;
  scoreType: ScoreType;
  player: PlayerInfo;
}

interface PlayerScorecardProps extends PlayerScorecardData, TableProps {}

export const PlayerScorecard = (props: PlayerScorecardProps) => {
  const { day, scoreType, player, ...otherProps } = props;
  const { status, data } = useScores(day, scoreType, player.id);

  const placeholderRow = (index: number) => ({
    name: `Placeholder${index}`,
    scores: PLACEHOLDER_SCORES,
  });
  const days =
    day === TournamentDay.ALL
      ? [TournamentDay.FRIDAY, TournamentDay.SATURDAY, TournamentDay.SUNDAY]
      : [day];
  const scorecardRows =
    status === 'success'
      ? data.map((score) => ({ name: score.day, scores: score.scores }))
      : days.map((_, index) => placeholderRow(index));

  return (
    <Scorecard
      rows={scorecardRows}
      rowsQueryStatus={status}
      scoreType={scoreType}
      {...otherProps}
    />
  );
};

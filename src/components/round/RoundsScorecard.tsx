import { TableProps } from '@mantine/core';

import { Scorecard } from 'components/common/Scorecard';
import { ScoreType, TournamentDay } from 'components/constants';

import { PlayerInfo, useScores } from 'hooks/rounds';

const PLACEHOLDER_SCORES = new Array(18).fill('');

export interface RoundsScorecardData {
  day: TournamentDay;
  scoreType: ScoreType;
  player: PlayerInfo;
}

interface RoundsScorecardProps extends RoundsScorecardData, TableProps {}

export const RoundsScorecard = (props: RoundsScorecardProps) => {
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

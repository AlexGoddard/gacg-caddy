import { TableProps } from '@mantine/core';

import { PLACEHOLDER_SCORES, ScoreType, TournamentDay } from 'data/constants';

import { PlayerInfo } from 'hooks/rounds/model';
import { useScores } from 'hooks/rounds/useScores';

import { Scorecard } from './Scorecard';

export interface PlayerScorecardData {
  day: TournamentDay;
  scoreType: ScoreType;
  player: PlayerInfo;
}

interface PlayerScorecardProps extends PlayerScorecardData, TableProps {}

export const PlayerScorecard = (props: PlayerScorecardProps) => {
  const { day, scoreType, player, ...otherProps } = props;
  const { status, data } = useScores(day, scoreType, player.id);

  const placeholderRow = (day: TournamentDay) => ({
    playerId: -1,
    day: day,
    label: day,
    scores: PLACEHOLDER_SCORES,
  });
  const days =
    day === TournamentDay.ALL
      ? [TournamentDay.FRIDAY, TournamentDay.SATURDAY, TournamentDay.SUNDAY]
      : [day];
  const scorecardRows =
    status === 'success'
      ? data.map((score) => ({
          playerId: player.id,
          day: score.day,
          label: score.day,
          scores: score.scores,
        }))
      : days.map((day) => placeholderRow(day));

  return (
    <Scorecard
      rows={scorecardRows}
      rowsQueryStatus={status}
      scoreType={scoreType}
      {...otherProps}
    />
  );
};

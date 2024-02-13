import { TableProps } from '@mantine/core';

import { Scorecard } from 'components/display/Scorecard';

import { PLACEHOLDER_SCORES, ScoreType, TournamentDay } from 'data/constants';

import { useCalcuttaTeamHoles } from 'hooks/calcutta/useCalcuttaTeamHoles';
import { PlayerInfo } from 'hooks/rounds/model';

export interface CalcuttaScorecardData {
  day: TournamentDay;
  scoreType: ScoreType;
  a: PlayerInfo;
  b: PlayerInfo;
}

interface CalcuttaScorecardProps extends CalcuttaScorecardData, TableProps {}

export const CalcuttaScorecard = (props: CalcuttaScorecardProps) => {
  const { day, scoreType, a, b, ...otherProps } = props;
  const { status, data } = useCalcuttaTeamHoles(day, scoreType, a.id, b.id);

  const placeholderRow = (label: string) => ({
    playerId: -1,
    day: day,
    label: label,
    scores: PLACEHOLDER_SCORES,
  });
  const scorecardRows =
    status === 'success'
      ? [
          { playerId: a.id, day: day, label: a.name, scores: data.a },
          { playerId: b.id, day: day, label: b.name, scores: data.b },
          { day: day, label: 'Team', scores: data.team },
        ]
      : ['A Player', 'B Player', 'Team'].map((label) => placeholderRow(label));

  return (
    <Scorecard
      rows={scorecardRows}
      rowsQueryStatus={status}
      scoreType={scoreType}
      {...otherProps}
    />
  );
};

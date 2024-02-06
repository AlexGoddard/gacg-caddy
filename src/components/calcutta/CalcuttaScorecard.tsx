import { TableProps } from '@mantine/core';
import { Scorecard } from 'components/common/Scorecard';

import { ScoreType, TournamentDay } from 'components/constants';
import { PlayerInfo, useCalcuttaTeamHoles } from 'hooks/rounds';

const PLACEHOLDER_SCORES = new Array(18).fill('');

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
  const scorecardRows =
    status === 'success'
      ? [
          { name: a.name, scores: data.a },
          { name: b.name, scores: data.b },
          { name: 'Team', scores: data.team, isTeamScore: true },
        ]
      : [
          { name: 'Placeholder1..', scores: PLACEHOLDER_SCORES },
          { name: 'Placeholder2..', scores: PLACEHOLDER_SCORES },
          { name: 'Placeholder3..', scores: PLACEHOLDER_SCORES },
        ];

  return (
    <Scorecard
      rows={scorecardRows}
      rowsQueryStatus={status}
      scoreType={scoreType}
      {...otherProps}
    />
  );
};

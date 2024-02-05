import { ReactNode } from 'react';
import { Indicator, Skeleton, Table } from '@mantine/core';

import { ScorecardProps } from 'components/calcutta/Calcutta';
import { useHoles } from 'hooks/holes';

interface HoleHeaders {
  numbers: ReactNode[];
  pars: ReactNode[];
  handicaps: ReactNode[];
}

export const Scorecard = (props: ScorecardProps) => {
  const { data, ...otherProps } = props;
  const { isSuccess, isPending, data: holeData } = useHoles();
  const holes = isSuccess ? holeData : [];

  const holeHeaders: HoleHeaders = {
    numbers: [],
    pars: [],
    handicaps: [],
  };
  holes.map((hole) => {
    holeHeaders.numbers.push(
      <Table.Td key={`hole-${hole.holeNumber}-number`}>{hole.holeNumber}</Table.Td>,
    );
    holeHeaders.pars.push(
      <Table.Td key={`hole-${hole.holeNumber}-par`} c="green">
        {hole.par}
      </Table.Td>,
    );
    holeHeaders.handicaps.push(
      <Table.Td key={`hole-${hole.holeNumber}-handicap`} c="red">
        {hole.handicap}
      </Table.Td>,
    );
  });

  const scoreRows = (name: string, scores: number[], isPlayerScore = true) => {
    const scoreElements = scores.map((holeScore, holeIndex) => (
      <Table.Td key={`${name}-hole-${holeIndex + 1}-score`}>
        {isPlayerScore && data.teamScores[holeIndex] === holeScore ? (
          <Indicator size={4} color="green.7" zIndex={1}>
            {holeScore}
          </Indicator>
        ) : (
          <>{holeScore}</>
        )}
      </Table.Td>
    ));
    return (
      <Table.Tr key={`${name}-table-row`}>
        <Table.Td className="leftLabel">{name}</Table.Td>
        {scoreElements.slice(0, 9)}
        <Table.Td>{scores.slice(0, 9).reduce((sum, current) => sum + current, 0)}</Table.Td>
        {scoreElements.slice(-9)}
        <Table.Td>{scores.slice(-9).reduce((sum, current) => sum + current, 0)}</Table.Td>
        <Table.Td>{scores.reduce((sum, current) => sum + current, 0)}</Table.Td>
      </Table.Tr>
    );
  };

  return (
    <Skeleton visible={isPending} className="scorecardSkeleton">
      <Table p="md" bg="dark.9" className="scorecard" {...otherProps}>
        <Table.Tbody>
          {/* Headers */}
          <Table.Tr className="scorecardInfo">
            <Table.Td className="leftLabel">HOLE</Table.Td>
            {holeHeaders.numbers.slice(0, 9)}
            <Table.Td>Out</Table.Td>
            {holeHeaders.numbers.slice(-9)}
            <Table.Td>IN</Table.Td>
            <Table.Td>TOT</Table.Td>
          </Table.Tr>

          {/* A Player Scores */}
          {scoreRows(data.a.name, data.a.scores)}

          {/* B Player Scores */}
          {scoreRows(data.b.name, data.b.scores)}

          {/* Pars */}
          <Table.Tr className="scorecardInfo">
            <Table.Td c="green" className="leftLabel">
              PAR
            </Table.Td>
            {holeHeaders.pars.slice(0, 9)}
            <Table.Td c="green">36</Table.Td>
            {holeHeaders.pars.slice(-9)}
            <Table.Td c="green">36</Table.Td>
            <Table.Td c="green">72</Table.Td>
          </Table.Tr>

          {/* Team Scores */}
          {scoreRows('Team', data.teamScores, false)}

          {/* Handicaps */}
          <Table.Tr className="scorecardInfo">
            <Table.Td c="red" className="leftLabel">
              HANDICAP
            </Table.Td>
            {holeHeaders.handicaps.slice(0, 9)}
            <Table.Td></Table.Td>
            {holeHeaders.handicaps.slice(-9)}
            <Table.Td></Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Skeleton>
  );
};

import { Indicator, Table } from '@mantine/core';
import { holes } from 'data/holes';
import { ScorecardProps } from './Calcutta';

export const Scorecard = (props: ScorecardProps) => {
  const { data, ...otherProps } = props;
  const holeHeaders = holes
    .getNumbers()
    .map((holeNumber) => <Table.Td key={`hole-${holeNumber}-number`}>{holeNumber}</Table.Td>);
  const holePars = holes.getPars().map((par, holeIndex) => (
    <Table.Td key={`hole-${holeIndex + 1}-par`} c="green">
      {par}
    </Table.Td>
  ));
  const holeHandicaps = holes.getHandicaps().map((handicap, holeIndex) => (
    <Table.Td key={`hole-${holeIndex + 1}-handicap`} c="red">
      {handicap}
    </Table.Td>
  ));

  const scoreRows = (name: string, scores: number[], isPlayerScore = true) => {
    const scoreElements = scores.map((holeScore, holeIndex) => (
      <Table.Td key={`${name}-hole-${holeIndex + 1}-score`}>
        {isPlayerScore && data.teamScores[holeIndex] === holeScore ? (
          <Indicator size={4} color="green.7" zIndex={99}>
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
    <Table p="md" bg="dark.9" className="scorecard" {...otherProps}>
      <Table.Tbody>
        {/* Headers */}
        <Table.Tr className="scorecardInfo">
          <Table.Td className="leftLabel">HOLE</Table.Td>
          {holeHeaders.slice(0, 9)}
          <Table.Td>Out</Table.Td>
          {holeHeaders.slice(-9)}
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
          {holePars.slice(0, 9)}
          <Table.Td c="green">36</Table.Td>
          {holePars.slice(-9)}
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
          {holeHandicaps.slice(0, 9)}
          <Table.Td></Table.Td>
          {holeHandicaps.slice(-9)}
          <Table.Td></Table.Td>
          <Table.Td></Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};

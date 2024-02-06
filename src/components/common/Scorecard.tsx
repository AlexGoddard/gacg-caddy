import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Indicator,
  LoadingOverlay,
  Overlay,
  Table,
  TableProps,
  Title,
} from '@mantine/core';

import { ScoreType } from 'components/constants';
import { sum } from 'components/util';
import { useHoles } from 'hooks/holes';

const PLACEHOLDER_HOLES = new Array(18).fill(4).map((hole, index) => {
  return { holeNumber: index, par: hole, handicap: hole };
});

interface HoleHeaders {
  numbers: ReactNode[];
  pars: ReactNode[];
  handicaps: ReactNode[];
}

interface ScorecardProps extends TableProps {
  rows: ScoreRow[];
  rowsQueryStatus: 'error' | 'success' | 'pending';
  scoreType: ScoreType;
}

interface ScoreRow {
  name: string;
  scores: number[];
  isTeamScore?: boolean;
}

export const Scorecard = (props: ScorecardProps) => {
  const { rows, rowsQueryStatus, scoreType, ...otherProps } = props;
  const teamScores = rows.find((row) => row.isTeamScore);
  const holesQuery = useHoles();
  const holes = holesQuery.isSuccess ? holesQuery.data : PLACEHOLDER_HOLES;

  const isPending = rowsQueryStatus === 'pending' || holesQuery.isPending;
  const isError = rowsQueryStatus === 'error' || holesQuery.isError;

  const holeHeaders: HoleHeaders = {
    numbers: [],
    pars: [],
    handicaps: [],
  };
  holes.map((hole, index) => {
    holeHeaders.numbers[index] = (
      <Table.Td key={`hole-${hole.holeNumber}-number`}>{hole.holeNumber}</Table.Td>
    );
    holeHeaders.pars[index] = (
      <Table.Td key={`hole-${hole.holeNumber}-par`} c="green">
        {hole.par}
      </Table.Td>
    );
    holeHeaders.handicaps[index] = (
      <Table.Td key={`hole-${hole.holeNumber}-handicap`} c="red">
        {hole.handicap}
      </Table.Td>
    );
  });

  const scoreRow = (row: ScoreRow) => {
    const outScore = sum(row.scores.slice(0, 9));
    const inScore = sum(row.scores.slice(-9));
    const totalScore = sum(row.scores);
    const scoreElements = row.scores.map((holeScore, holeIndex) => (
      <Table.Td key={`${row.name}-hole-${holeIndex + 1}-score`}>
        {!row.isTeamScore && teamScores && teamScores.scores[holeIndex] === holeScore ? (
          <Indicator size={4} color="green.7" zIndex={1}>
            {holeScore}
          </Indicator>
        ) : (
          <>{holeScore}</>
        )}
      </Table.Td>
    ));

    return (
      <Table.Tr tt="capitalize" key={`${row.name}-table-row`}>
        <Table.Td className="leftLabel">{row.name}</Table.Td>
        {scoreElements.slice(0, 9)}
        <Table.Td>{outScore !== 0 && outScore}</Table.Td>
        {scoreElements.slice(-9)}
        <Table.Td>{inScore !== 0 && inScore}</Table.Td>
        <Table.Td>{totalScore !== 0 && totalScore}</Table.Td>
      </Table.Tr>
    );
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isPending}
        zIndex={1000}
        overlayProps={{ color: '#000', backgroundOpacity: 0.3, blur: 4 }}
        loaderProps={{ color: 'indigo', type: 'bars' }}
      />
      <Table p="md" bg="dark.9" className="scorecard" {...otherProps}>
        <Table.Tbody>
          {/* Headers */}
          <Table.Tr className="scorecardInfo">
            <Table.Td className="leftLabel">HOLE</Table.Td>
            {holeHeaders.numbers.slice(0, 9)}
            <Table.Td>OUT</Table.Td>
            {holeHeaders.numbers.slice(-9)}
            <Table.Td>IN</Table.Td>
            <Table.Td tt="uppercase">{scoreType}</Table.Td>
          </Table.Tr>

          {/* First Two Score Rows */}
          {rows.slice(0, 2).map((row) => scoreRow(row))}

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

          {/* Last Two Score Rows */}
          {rows.slice(2, 4).map((row) => scoreRow(row))}

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
      {isError && (
        <Overlay color="#000" backgroundOpacity={0.4} blur={5}>
          <Flex justify="center" align="center" h="100%">
            <Title order={2}>Failed to load scorecard</Title>
          </Flex>
        </Overlay>
      )}
    </Box>
  );
};
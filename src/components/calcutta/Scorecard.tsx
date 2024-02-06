import { ReactNode } from 'react';
import { Box, Flex, Indicator, LoadingOverlay, Overlay, Table, Title } from '@mantine/core';
import { useQueries } from '@tanstack/react-query';

import { ScorecardProps } from 'components/calcutta/Calcutta';
import { useHolesQuery } from 'hooks/holes';
import { useCalcuttaTeamHolesQuery } from 'hooks/rounds';
import { sum } from 'components/util';

interface HoleHeaders {
  numbers: ReactNode[];
  pars: ReactNode[];
  handicaps: ReactNode[];
}

export const Scorecard = (props: ScorecardProps) => {
  const { data, ...otherProps } = props;
  const [calcuttaTeamHolesQuery, holesQuery] = useQueries({
    queries: [
      useCalcuttaTeamHolesQuery(data.day, data.scoreType, data.a.id, data.b.id),
      useHolesQuery,
    ],
  });
  const calcuttaTeamHoles = calcuttaTeamHolesQuery.isSuccess
    ? calcuttaTeamHolesQuery.data
    : { a: [], b: [], team: [] };
  const holes = holesQuery.isSuccess ? holesQuery.data : [];

  const isPending = calcuttaTeamHolesQuery.isPending || holesQuery.isPending;
  const isError = calcuttaTeamHolesQuery.isError || holesQuery.isError;

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
        {isPlayerScore && calcuttaTeamHoles.team[holeIndex] === holeScore ? (
          <Indicator size={4} color="green.7" zIndex={1}>
            {holeScore}
          </Indicator>
        ) : (
          <>{holeScore}</>
        )}
      </Table.Td>
    ));
    const outScore = sum(scores.slice(0, 9));
    const inScore = sum(scores.slice(-9));
    const totalScore = sum(scores);
    return (
      <Table.Tr key={`${name}-table-row`}>
        <Table.Td className="leftLabel">{name}</Table.Td>
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
            <Table.Td>Out</Table.Td>
            {holeHeaders.numbers.slice(-9)}
            <Table.Td>IN</Table.Td>
            <Table.Td tt="uppercase">{data.scoreType}</Table.Td>
          </Table.Tr>

          {/* A Player Scores */}
          {scoreRows(data.a.name, calcuttaTeamHoles.a)}

          {/* B Player Scores */}
          {scoreRows(data.b.name, calcuttaTeamHoles.b)}

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
          {scoreRows('Team', calcuttaTeamHoles.team, false)}

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

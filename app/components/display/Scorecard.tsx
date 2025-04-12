import { ReactNode, useState } from 'react';

import {
  ActionIcon,
  Box,
  Flex,
  Group,
  Indicator,
  LoadingOverlay,
  Modal,
  Overlay,
  Table,
  TableProps,
  Title,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';

import { EditRoundForm, EditRoundFormTitle } from 'pages/rounds/EditRoundForm';

import { DEFAULT_OVERLAY, ScoreType, TournamentDay } from 'data/constants';
import { getIn, getOut, sum } from 'utils/holes';

import { useHoles } from 'hooks/holes/useHoles';
import { Round } from 'hooks/rounds/model';
import { useDevice } from 'hooks/useDevice';

import './style.less';

const PLACEHOLDER_HOLES = new Array(18)
  .fill(4)
  .map((hole, index) => ({ holeNumber: index, par: hole, handicap: hole }));

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
  playerId?: number;
  day: TournamentDay;
  label: string;
  scores: number[];
}

export const Scorecard = (props: ScorecardProps) => {
  const { rows, rowsQueryStatus, scoreType, ...otherProps } = props;

  const [selectedRound, setSelectedRound] = useState<Round>();
  const [
    editRoundFormOpened,
    { open: editRoundFormOpen, close: editRoundFormClose },
  ] = useDisclosure(false);

  const { isMobile } = useDevice();
  const holesQuery = useHoles();

  const holes = holesQuery.isSuccess ? holesQuery.data : PLACEHOLDER_HOLES;
  const teamScores = rows.find((row) => !row.playerId);
  const isPending = rowsQueryStatus === 'pending' || holesQuery.isPending;
  const isError = rowsQueryStatus === 'error' || holesQuery.isError;

  const holeHeaders: HoleHeaders = {
    numbers: [],
    pars: [],
    handicaps: [],
  };
  holes.map((hole, index) => {
    holeHeaders.numbers[index] = (
      <Table.Td key={`hole-${hole.holeNumber}-number`}>
        {hole.holeNumber}
      </Table.Td>
    );
    holeHeaders.pars[index] = (
      <Table.Td key={`hole-${hole.holeNumber}-par`} c="sage">
        {hole.par}
      </Table.Td>
    );
    holeHeaders.handicaps[index] = (
      <Table.Td key={`hole-${hole.holeNumber}-handicap`} c="blush">
        {hole.handicap}
      </Table.Td>
    );
  });

  const scoreRow = (row: ScoreRow) => {
    const outScore = getOut(row.scores);
    const inScore = getIn(row.scores);
    const totalScore = sum(row.scores);
    const scoreElements = row.scores.map((holeScore, holeIndex) => (
      <Table.Td key={`${row.label}-hole-${holeIndex + 1}-score`}>
        {row.playerId &&
        teamScores &&
        teamScores.scores[holeIndex] === holeScore ? (
          <Indicator size={4} color="sage" zIndex={1}>
            {holeScore}
          </Indicator>
        ) : (
          <>{holeScore}</>
        )}
      </Table.Td>
    ));

    return (
      <Table.Tr tt="capitalize" key={`${row.label}-table-row`}>
        <Table.Td className="leftLabel">
          <Group justify="space-between" gap="xs">
            {row.label}
            {scoreType === ScoreType.GROSS && row.playerId && (
              <ActionIcon
                variant="subtle"
                color="dimmed"
                size="sm"
                onClick={() => {
                  setSelectedRound({
                    playerId: row.playerId,
                    day: row.day,
                    grossHoles: row.scores,
                  });
                  editRoundFormOpen();
                }}
              >
                <IconEdit style={{ width: rem(20), height: rem(20) }} />
              </ActionIcon>
            )}
          </Group>
        </Table.Td>
        {scoreElements.slice(0, 9)}
        <Table.Td>{outScore !== 0 && outScore}</Table.Td>
        {scoreElements.slice(-9)}
        <Table.Td>{inScore !== 0 && inScore}</Table.Td>
        <Table.Td>{totalScore !== 0 && totalScore}</Table.Td>
      </Table.Tr>
    );
  };

  return (
    <>
      <Modal
        opened={editRoundFormOpened}
        onClose={editRoundFormClose}
        title={<EditRoundFormTitle />}
        size="xl"
        fullScreen={isMobile}
        overlayProps={DEFAULT_OVERLAY}
      >
        <EditRoundForm round={selectedRound} closeModal={editRoundFormClose} />
      </Modal>
      <Box pos="relative">
        <LoadingOverlay
          visible={isPending}
          zIndex={1000}
          overlayProps={{ color: '#000', backgroundOpacity: 0.3, blur: 4 }}
          loaderProps={{ type: 'bars' }}
        />
        <Table className="scorecard" withColumnBorders {...otherProps}>
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
              <Table.Td c="sage" className="leftLabel">
                PAR
              </Table.Td>
              {holeHeaders.pars.slice(0, 9)}
              <Table.Td c="sage">36</Table.Td>
              {holeHeaders.pars.slice(-9)}
              <Table.Td c="sage">36</Table.Td>
              <Table.Td c="sage">72</Table.Td>
            </Table.Tr>

            {/* Last Two Score Rows */}
            {rows.slice(2, 4).map((row) => scoreRow(row))}

            {/* Handicaps */}
            <Table.Tr className="scorecardInfo">
              <Table.Td c="blush" className="leftLabel">
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
          <Overlay color="#000" backgroundOpacity={0.4} blur={5} zIndex={99}>
            <Flex justify="center" align="center" h="100%">
              <Title order={2}>Failed to load scorecard</Title>
            </Flex>
          </Overlay>
        )}
      </Box>
    </>
  );
};

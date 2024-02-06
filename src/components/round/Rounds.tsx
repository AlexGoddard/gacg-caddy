import JSZip from 'jszip';
import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { ActionIcon, Box, Group, Paper, Stack, StackProps } from '@mantine/core';
import { IconDownload, IconGolfOff } from '@tabler/icons-react';

import { DaySelector } from 'components/common/form-inputs';
import { Place, Podium } from 'components/common/Podium';
import { SectionTitle } from 'components/common/typography';
import { DEFAULT_GRADIENT, ScoreType, TournamentDay } from 'components/constants';
import { RoundsScorecard, RoundsScorecardData } from 'components/round/RoundsScorecard';
import { getTournamentDay, getTournamentYear } from 'components/util';
import { PlayerRound, useRounds } from 'hooks/rounds';

import './style.less';

const HEADERS = ['Player', 'Gross', 'Net'];
const ELIGIBLE_DAYS = Object.values(TournamentDay);

interface RoundData {
  id: number;
  player: string;
  score: number;
  scorecardData: RoundsScorecardData;
}

interface RoundsTableData {
  gross: RoundData[];
  net: RoundData[];
}

interface RoundsTableProps extends StackProps {
  scoreType: ScoreType;
  records: RoundData[];
}

export function Rounds() {
  const [tournamentDay, setTournamentDay] = useState(getTournamentDay());
  const { isPending, isSuccess, data } = useRounds(tournamentDay);
  const rounds = isSuccess ? data : [];

  const roundsTableData = getRoundsTableData(rounds);

  const downloadRounds = () => {
    const zip = new JSZip();
    Object.values(ScoreType).map((scoreType) => {
      const roundsFileData = [HEADERS];
      roundsTableData[scoreType].map((round) =>
        roundsFileData.push([round.player, round.score.toString()]),
      );
      zip.file(
        `${scoreType}.csv`,
        new Blob([roundsFileData.map((row) => row.join(',')).join('\n')], {
          type: 'text/csv',
        }),
      );
    });
    zip.generateAsync({ type: 'blob' }).then((zippedFile) => {
      const element = document.createElement('a');
      element.href = URL.createObjectURL(zippedFile);
      element.download = `rounds-${tournamentDay}-${getTournamentYear()}.zip`;
      element.click();
    });
  };

  function getRoundsTableData(rounds: PlayerRound[]) {
    const tableData: RoundsTableData = { gross: [], net: [] };
    rounds.map((round, index) => {
      Object.values(ScoreType).map((scoreType) => {
        tableData[scoreType].push({
          id: index,
          player: round.player.name,
          score: round[scoreType],
          scorecardData: {
            day: tournamentDay,
            scoreType: scoreType,
            player: round.player,
          },
        });
      });
    });
    return sortRoundsTableData(tableData);
  }

  function sortRoundsTableData(tableData: RoundsTableData) {
    tableData.gross = tableData.gross.sort((a, b) => a.score - b.score);
    tableData.net = tableData.net.sort((a, b) => a.score - b.score);
    return tableData;
  }

  const getTopThree = (scoreType: ScoreType): Place[] => {
    const lowestScores: number[] = [];
    for (const round of roundsTableData[scoreType]) {
      if (!lowestScores.includes(round.score)) lowestScores.push(round.score);
      if (lowestScores.length === 3) break;
    }
    return lowestScores.map((score, index) => ({
      number: index + 1,
      score: score,
      winners: roundsTableData[scoreType]
        .filter((round) => round.score === score)
        .map((round) => round.player),
    }));
  };

  const RoundsTable = (props: RoundsTableProps) => {
    const { scoreType, records, ...otherProps } = props;

    return (
      <Stack {...otherProps}>
        <SectionTitle order={2}>{scoreType}</SectionTitle>
        <Paper withBorder shadow="lg">
          <DataTable
            ta="left"
            fz="lg"
            withTableBorder={false}
            borderRadius="4px"
            height={470}
            minHeight={150}
            noRecordsText="No results yet"
            noRecordsIcon={
              <Box className="noRecordsBox">
                <IconGolfOff size={24} />
              </Box>
            }
            styles={{
              header: (theme) => ({
                backgroundColor: theme.colors.dark[8],
              }),
            }}
            columns={[
              {
                accessor: 'player',
              },
              {
                accessor: 'score',
              },
            ]}
            records={records}
            fetching={isPending}
            loaderType="bars"
            loaderColor="indigo"
            rowExpansion={{
              collapseProps: {
                transitionDuration: 400,
                animateOpacity: false,
                transitionTimingFunction: 'ease-out',
              },
              content: ({ record }) => (
                <RoundsScorecard
                  day={record.scorecardData.day}
                  scoreType={record.scorecardData.scoreType}
                  player={record.scorecardData.player}
                />
              ),
            }}
          />
        </Paper>
      </Stack>
    );
  };

  return (
    <Stack>
      <Group justify="space-between">
        <DaySelector
          days={ELIGIBLE_DAYS}
          value={tournamentDay}
          onChange={(day) => setTournamentDay(day as TournamentDay)}
        />
        <Group>
          <ActionIcon
            disabled={!isSuccess}
            variant="gradient"
            aria-label="Download calcutta"
            gradient={DEFAULT_GRADIENT}
            onClick={downloadRounds}
          >
            <IconDownload />
          </ActionIcon>
        </Group>
      </Group>
      <Stack gap="xl">
        {tournamentDay === TournamentDay.ALL && (
          <Stack>
            <SectionTitle>Results</SectionTitle>
            <Group justify="space-around" align="flex-start">
              <Podium title="Gross" places={getTopThree(ScoreType.GROSS)} />
              <Podium title="Net" places={getTopThree(ScoreType.NET)} />
            </Group>
          </Stack>
        )}
        <SectionTitle>Rounds</SectionTitle>
        <RoundsTable scoreType={ScoreType.GROSS} records={roundsTableData.gross} />
        <RoundsTable scoreType={ScoreType.NET} records={roundsTableData.net} />
      </Stack>
    </Stack>
  );
}

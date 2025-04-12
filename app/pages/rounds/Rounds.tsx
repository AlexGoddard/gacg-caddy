import { useState } from 'react';

import { Group, Paper, Stack, StackProps } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

import { DownloadButton } from 'components/controls/Buttons';
import { DaySelector } from 'components/controls/DaySelector';
import { PlayerScorecard, PlayerScorecardData } from 'components/display/PlayerScorecard';
import { Place, Podium } from 'components/display/Podium';
import { SectionTitle } from 'components/display/typography/SectionTitle';
import { NoRecordsFeedback } from 'components/feedback/NoRecordsFeedback';

import { ScoreType, TournamentDay } from 'data/constants';
import { getTournamentDay, getTournamentYear } from 'utils/date';
import { NamedDownloadData, downloadZip } from 'utils/file';

import { PlayerRound } from 'hooks/rounds/model';
import { useRounds } from 'hooks/rounds/useRounds';

const HEADERS = ['Player', 'Gross', 'Net'];
const ELIGIBLE_DAYS = Object.values(TournamentDay);

interface RoundData {
  id: number;
  player: string;
  score: number;
  scorecardData: PlayerScorecardData;
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
    const fileName = `rounds-${tournamentDay}-${getTournamentYear()}.zip`;
    const toDownload: NamedDownloadData[] = Object.values(ScoreType).map((scoreType) => ({
      fileName: `${scoreType}.csv`,
      headers: HEADERS,
      rows: roundsTableData[scoreType].map((round) => [round.player, round.score.toString()]),
    }));
    downloadZip(fileName, toDownload);
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
            noRecordsIcon={<NoRecordsFeedback />}
            borderColor="var(--gacg-color-border)"
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
            rowExpansion={{
              collapseProps: {
                transitionDuration: 400,
                animateOpacity: false,
                transitionTimingFunction: 'ease-out',
              },
              content: ({ record }) => (
                <PlayerScorecard
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
        <DownloadButton
          disabled={!isSuccess}
          aria-label="Download calcutta"
          onClick={downloadRounds}
        />
      </Group>
      <Stack gap="xl">
        {tournamentDay === TournamentDay.ALL && (
          <Stack>
            <SectionTitle>Results</SectionTitle>
            <Group gap="xl" align="flex-start">
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

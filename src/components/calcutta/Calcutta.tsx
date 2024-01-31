import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import { ActionIcon, Box, Group, Stack, TableProps, Title } from '@mantine/core';
import { IconDownload, IconGolfOff } from '@tabler/icons-react';

import { Scorecard } from './Scorecard';
import { DaySelector } from 'components/common/form-inputs';
import { DEFAULT_GRADIENT, ScoreType, TournamentDay } from 'components/constants';
import { getScore, getTournamentDay, getTournamentYear } from 'components/util';
import { players } from 'data/players';
import { CalcuttaTeam, rounds } from 'data/rounds';

import './style.less';

interface ScorecardData {
  a: PlayerData;
  b: PlayerData;
  teamScores: number[];
}

export interface ScorecardProps extends Omit<TableProps, 'data'> {
  data: ScorecardData;
}

interface PlayerData {
  name: string;
  scores: number[];
}

interface CalcuttaTableData {
  gross: CalcuttaTeamData[];
  net: CalcuttaTeamData[];
}

interface CalcuttaTeamData {
  id?: number;
  aPlayer: string;
  bPlayer: string;
  score: number;
  scorecardData: ScorecardData;
}

export function Calcutta() {
  const [tournamentDay, setTournamentDay] = useState(getTournamentDay());
  const [grossExpandedRecordIds, setGrossExpandedRecordIds] = useState<string[]>([]);
  const [netExpandedRecordIds, setNetExpandedRecordIds] = useState<string[]>([]);

  const tableStates = {
    gross: {
      recordIds: grossExpandedRecordIds,
      setExpandedRecordIds: setGrossExpandedRecordIds,
    },
    net: {
      recordIds: netExpandedRecordIds,
      setExpandedRecordIds: setNetExpandedRecordIds,
    },
  };

  const isSample = tournamentDay !== TournamentDay.SUNDAY;
  const calcutta = rounds.getCalcutta(tournamentDay);

  const collapseExpandedRows = () => {
    setGrossExpandedRecordIds([]);
    setNetExpandedRecordIds([]);
  };

  const calcuttaTableData = getCalcuttaTableData(calcutta);

  const downloadCalcutta = () => {
    const sampleHeaders = [
      'A Player',
      'Handicap',
      'Friday Gross',
      'Friday Net',
      'Saturday Gross',
      'Saturday Net',
      'B Player',
      'Handicap',
      'Friday Gross',
      'Friday Net',
      'Saturday Gross',
      'Saturday Net',
      'Team Friday Gross',
      'Team Friday Net',
      'Team Saturday Gross',
      'Team Saturday Net',
    ];
    const calcuttaHeaders = [
      'A Player',
      'Handicap',
      'Gross',
      'Net',
      'B Player',
      'Handicap',
      'Gross',
      'Net',
      'Team Gross',
      'Team Net',
    ];
    const calcuttaFileData = [];
    if (isSample) {
      const fridayCalcutta = rounds.getCalcutta(TournamentDay.FRIDAY);
      const saturdayCalcutta = rounds.getCalcutta(TournamentDay.SATURDAY);
      calcuttaFileData.push(sampleHeaders);
      fridayCalcutta.map((fridayCalcuttaTeam) => {
        const matchingSaturdayTeam = saturdayCalcutta.find(
          (saturdayCalcuttaTeam) => fridayCalcuttaTeam.a.id === saturdayCalcuttaTeam.a.id,
        );
        // Don't include teams without scores on Friday and Saturday
        if (!matchingSaturdayTeam) return;

        calcuttaFileData.push([
          // A Player
          players.getPlayerName(fridayCalcuttaTeam.a.id),
          players.getHandicap(fridayCalcuttaTeam.a.id),
          getScore(fridayCalcuttaTeam.a.gross),
          getScore(fridayCalcuttaTeam.a.net),
          getScore(matchingSaturdayTeam.a.gross),
          getScore(matchingSaturdayTeam.a.net),
          // B Player
          players.getPlayerName(fridayCalcuttaTeam.b.id),
          players.getHandicap(fridayCalcuttaTeam.b.id),
          getScore(fridayCalcuttaTeam.b.gross),
          getScore(fridayCalcuttaTeam.b.net),
          getScore(matchingSaturdayTeam.b.gross),
          getScore(matchingSaturdayTeam.b.net),
          // Team
          getScore(fridayCalcuttaTeam.gross),
          getScore(fridayCalcuttaTeam.net),
          getScore(matchingSaturdayTeam.gross),
          getScore(matchingSaturdayTeam.net),
        ]);
      });
    } else {
      calcuttaFileData.push(calcuttaHeaders);
      calcutta.map((calcuttaTeam) =>
        calcuttaFileData.push([
          // A Player
          players.getPlayerName(calcuttaTeam.a.id),
          players.getHandicap(calcuttaTeam.a.id),
          getScore(calcuttaTeam.a.gross),
          getScore(calcuttaTeam.a.net),
          // B Player
          players.getPlayerName(calcuttaTeam.b.id),
          players.getHandicap(calcuttaTeam.b.id),
          getScore(calcuttaTeam.b.gross),
          getScore(calcuttaTeam.b.net),
          // Team
          getScore(calcuttaTeam.gross),
          getScore(calcuttaTeam.net),
        ]),
      );
    }
    const calcuttaFile = new Blob([calcuttaFileData.map((row) => row.join(',')).join('\n')], {
      type: 'text/csv',
    });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(calcuttaFile);
    element.download = `calcutta-${isSample ? 'sample-' : ''}${getTournamentYear()}.csv`;
    element.click();
  };

  const calcuttaTables = Object.values(ScoreType).map((scoreType) => {
    const title = `${scoreType} Calcutta${isSample ? ' Sample' : ''}`;
    return (
      <Stack key={`${scoreType}-calcutta-table`} p="lg" bg="dark.8">
        <Title tt="capitalize">{title}</Title>
        <DataTable
          ta="left"
          fz="lg"
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
              accessor: 'aPlayer',
            },
            {
              accessor: 'bPlayer',
            },
            {
              accessor: 'score',
            },
          ]}
          records={calcuttaTableData[scoreType]}
          rowExpansion={{
            collapseProps: {
              transitionDuration: 400,
              animateOpacity: false,
              transitionTimingFunction: 'ease-out',
            },
            expanded: {
              recordIds: tableStates[scoreType].recordIds,
              onRecordIdsChange: tableStates[scoreType].setExpandedRecordIds,
            },
            content: ({ record }) => <Scorecard data={record.scorecardData} />,
          }}
        />
      </Stack>
    );
  });

  return (
    <Stack>
      <Group justify="space-between">
        <DaySelector
          value={tournamentDay}
          onChange={(day) => {
            collapseExpandedRows();
            setTournamentDay(day as TournamentDay);
          }}
        />
        <ActionIcon
          variant="gradient"
          aria-label="Download calcutta"
          gradient={DEFAULT_GRADIENT}
          onClick={downloadCalcutta}
        >
          <IconDownload />
        </ActionIcon>
      </Group>
      {calcuttaTables}
    </Stack>
  );
}

const getCalcuttaTableData = (calcutta: CalcuttaTeam[]) => {
  const tableData: CalcuttaTableData = { gross: [], net: [] };
  calcutta.map((calcuttaTeam) => {
    const aPlayerName = players.getPlayerName(calcuttaTeam.a.id);
    const bPlayerName = players.getPlayerName(calcuttaTeam.b.id);
    Object.values(ScoreType).map((scoreType) => {
      tableData[scoreType].push({
        aPlayer: aPlayerName,
        bPlayer: bPlayerName,
        score: getScore(calcuttaTeam[scoreType]),
        scorecardData: {
          a: {
            name: aPlayerName,
            scores: calcuttaTeam.a[scoreType] ? calcuttaTeam.a[scoreType]! : [],
          },
          b: {
            name: bPlayerName,
            scores: calcuttaTeam.b[scoreType] ? calcuttaTeam.b[scoreType]! : [],
          },
          teamScores: calcuttaTeam[scoreType],
        },
      });
    });
  });
  return sortCalcuttaTableData(tableData);
};

const sortCalcuttaTableData = (tableData: CalcuttaTableData) => {
  tableData.gross = tableData.gross.sort((a, b) => a.score - b.score);
  tableData.net = tableData.net.sort((a, b) => a.score - b.score);

  // Find a way to skip expanded row close animation
  // when switching to different day to avoid needing
  // to set index after sort. Otherwise, a different
  // row in the selected day may play the close animation
  // and it looks odd. e.g. Friday -> expand row 1 ->
  // Switch to Saturday -> row 2 plays close animation
  tableData.gross = tableData.gross.map((calcuttaTeam, index) => {
    calcuttaTeam.id = index;
    return calcuttaTeam;
  });
  tableData.net = tableData.net.map((calcuttaTeam, index) => {
    calcuttaTeam.id = index;
    return calcuttaTeam;
  });
  return tableData;
};

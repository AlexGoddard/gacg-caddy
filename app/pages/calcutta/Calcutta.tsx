import { useState } from 'react';

import { Group, Paper, Stack, StackProps } from '@mantine/core';
import { useQueries } from '@tanstack/react-query';
import { DataTable } from 'mantine-datatable';

import { DownloadButton } from 'components/controls/Buttons';
import { DaySelector } from 'components/controls/DaySelector';
import { Place, Podium } from 'components/display/Podium';
import { SectionTitle } from 'components/display/typography/SectionTitle';
import { NoRecordsFeedback } from 'components/feedback/NoRecordsFeedback';
import { PrizePoolInput } from 'components/inputs/PrizePoolInput';

import { ScoreType, TournamentDay } from 'data/constants';
import { getTournamentDay, getTournamentYear } from 'utils/date';
import { DownloadData, downloadFile } from 'utils/file';
import { sum } from 'utils/holes';

import { CalcuttaTeamRound } from 'hooks/calcutta/model';
import { useCalcuttaQuery } from 'hooks/calcutta/useCalcutta';
import { useCalcuttaSampleQuery } from 'hooks/calcutta/useCalcuttaSample';

import { CalcuttaScorecard, CalcuttaScorecardData } from './CalcuttaScorecard';

interface CalcuttaTableData {
  gross: CalcuttaTeamData[];
  net: CalcuttaTeamData[];
}

interface CalcuttaTeamData {
  id: number;
  aPlayer: string;
  bPlayer: string;
  score: number;
  scorecardData: CalcuttaScorecardData;
}

interface CalcuttaWinner {
  aPlayer: string;
  bPlayer: string;
  score: number;
  amount: number;
  place: number;
  scoreType: ScoreType;
}

interface CalcuttaTableProps extends StackProps {
  scoreType: ScoreType;
  records: CalcuttaTeamData[];
}

export function Calcutta() {
  const [tournamentDay, setTournamentDay] = useState(getTournamentDay());
  const [prizePool, setPrizePool] = useState<string | number>(5000);

  const isSample = tournamentDay !== TournamentDay.SUNDAY;
  const [calcuttaQuery, calcuttaSampleQuery] = useQueries({
    queries: [
      useCalcuttaQuery(tournamentDay),
      useCalcuttaSampleQuery(isSample),
    ],
  });
  const calcutta = calcuttaQuery.isSuccess ? calcuttaQuery.data : [];

  const netPayouts = [0.3, 0.2, 0.15, 0.1, 0.05].map(
    (percent) => percent * Number(prizePool),
  );
  const grossPayouts = [0.1, 0.05].map(
    (percent) => percent * Number(prizePool),
  );

  const calcuttaTableData = getCalcuttaTableData(calcutta);

  const downloadCalcutta = () => {
    const fileName = `calcutta-${isSample ? 'sample-' : ''}${getTournamentYear()}.csv`;
    if (isSample) {
      const calcuttaSample = calcuttaSampleQuery.isSuccess
        ? calcuttaSampleQuery.data
        : [];
      const downloadData: DownloadData = {
        headers: [
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
        ],
        rows: calcuttaSample,
      };
      downloadFile(fileName, downloadData);
    } else {
      const downloadData: DownloadData = {
        headers: ['A Player', 'B Player', 'Gross', 'Net'],
        rows: calcutta.map((calcuttaTeam) => [
          calcuttaTeam.a.name,
          calcuttaTeam.b.name,
          calcuttaTeam.gross.toString(),
          calcuttaTeam.net.toString(),
        ]),
      };
      downloadFile(fileName, downloadData);
    }
  };

  const getWinnings = (
    payouts: number[],
    teamsAlreadyPlaced: number,
    numTeams: number,
  ) => {
    return (
      sum(payouts.slice(teamsAlreadyPlaced, teamsAlreadyPlaced + numTeams)) /
      numTeams
    );
  };

  const getWinners = () => {
    const winners: CalcuttaWinner[] = [];

    // The number of teams who have already placed
    let netPlaced = 0;
    let grossPlaced = 0;

    for (const netCalcuttaTeam of calcuttaTableData.net) {
      if (
        winners.find((winning) => winning.aPlayer === netCalcuttaTeam.aPlayer)
      )
        continue;
      if (netPlaced >= netPayouts.length) break;
      const grossWinners: CalcuttaTeamData[] = [];

      const possibleNetWinners = calcuttaTableData.net.filter(
        (possibleMatch) => possibleMatch.score === netCalcuttaTeam.score,
      );
      // Determine if each team could win more going gross
      possibleNetWinners.forEach((winner) => {
        const remainingGrossTeams = calcuttaTableData.gross.filter(
          (possibleMatch) =>
            grossWinners.find(
              (grossWinner) => grossWinner.aPlayer === possibleMatch.aPlayer,
            )
              ? false
              : true,
        );
        const winnerGrossScore = calcuttaTableData.gross.find(
          (possibleMatch) => possibleMatch.aPlayer === winner.aPlayer,
        )?.score;
        remainingGrossTeams
          .slice(0, grossPayouts.length - grossWinners.length)
          .forEach((remainingGrossTeam, index) => {
            if (
              grossWinners.find(
                (grossWinner) => grossWinner.aPlayer === winner.aPlayer,
              )
            ) {
              return;
            }
            if (remainingGrossTeam.score === winnerGrossScore) {
              const possibleGrossWinners = remainingGrossTeams.filter(
                (possibleMatch) =>
                  possibleMatch.score === remainingGrossTeam.score,
              );
              const possibleNetPlaceWinnings = getWinnings(
                netPayouts,
                netPlaced,
                possibleNetWinners.length,
              );
              const possibleGrossPlaceWinnings = getWinnings(
                grossPayouts,
                // Add index to account for teams that will
                // place gross higher than the current team
                grossWinners.length,
                possibleGrossWinners.length,
              );
              if (possibleGrossPlaceWinnings > possibleNetPlaceWinnings) {
                grossWinners.push({
                  ...winner,
                  ...{ score: winnerGrossScore },
                });
              }
            }
          });
      });

      // Filter out teams that went gross
      const netWinners = possibleNetWinners.filter((winner) =>
        grossWinners.find(
          (grossWinner) => grossWinner.aPlayer === winner.aPlayer,
        )
          ? false
          : true,
      );

      grossWinners.map((winner) => {
        winners.push({
          aPlayer: winner.aPlayer,
          bPlayer: winner.bPlayer,
          score: winner.score,
          amount: getWinnings(grossPayouts, grossPlaced, grossWinners.length),
          place: grossPlaced + 1,
          scoreType: ScoreType.GROSS,
        });
      });
      grossPlaced += grossWinners.length;

      netWinners.map((winner) => {
        winners.push({
          aPlayer: winner.aPlayer,
          bPlayer: winner.bPlayer,
          score: winner.score,
          amount: getWinnings(netPayouts, netPlaced, netWinners.length),
          place: netPlaced + 1,
          scoreType: ScoreType.NET,
        });
      });
      netPlaced += netWinners.length;
    }

    if (grossPlaced < grossPayouts.length) {
      const remainingGrossTeams = calcuttaTableData.gross.filter(
        (possibleMatch) =>
          winners.find((winning) => winning.aPlayer === possibleMatch.aPlayer)
            ? false
            : true,
      );
      for (const grossTeam of remainingGrossTeams) {
        if (winners.find((winning) => winning.aPlayer === grossTeam.aPlayer))
          continue;
        if (grossPlaced >= grossPayouts.length) break;

        const grossWinners = remainingGrossTeams.filter(
          (possibleMatch) => possibleMatch.score === grossTeam.score,
        );
        const grossWinnings = getWinnings(
          grossPayouts,
          grossPlaced,
          grossWinners.length,
        );
        grossWinners.map((grossWinner) => {
          if (
            winners.find(
              (winner) =>
                winner.scoreType === ScoreType.GROSS &&
                winner.score === grossWinner.score,
            )
          ) {
            winners.find(
              (winner) =>
                winner.scoreType === ScoreType.GROSS &&
                winner.score === grossWinner.score,
            )!.amount = getWinnings(
              grossPayouts,
              grossPlaced - 1,
              grossWinners.length + 1,
            );
            winners.push({
              aPlayer: grossWinner.aPlayer,
              bPlayer: grossWinner.bPlayer,
              score: grossWinner.score,
              amount: getWinnings(
                grossPayouts,
                grossPlaced - 1,
                grossWinners.length + 1,
              ),
              place: grossPlaced,
              scoreType: ScoreType.GROSS,
            });
          } else {
            winners.push({
              aPlayer: grossWinner.aPlayer,
              bPlayer: grossWinner.bPlayer,
              score: grossWinner.score,
              amount: grossWinnings,
              place: grossPlaced + 1,
              scoreType: ScoreType.GROSS,
            });
          }
        });
        grossPlaced += grossWinners.length;
      }
    }
    return winners;
  };

  function getCalcuttaTableData(calcutta: CalcuttaTeamRound[]) {
    const tableData: CalcuttaTableData = { gross: [], net: [] };
    calcutta.map((calcuttaTeam, index) => {
      Object.values(ScoreType).map((scoreType) => {
        tableData[scoreType].push({
          id: index,
          aPlayer: calcuttaTeam.a.name,
          bPlayer: calcuttaTeam.b.name,
          score: calcuttaTeam[scoreType],
          scorecardData: {
            day: tournamentDay,
            scoreType: scoreType,
            a: calcuttaTeam.a,
            b: calcuttaTeam.b,
          },
        });
      });
    });
    return sortCalcuttaTableData(tableData);
  }

  function sortCalcuttaTableData(tableData: CalcuttaTableData) {
    tableData.gross = tableData.gross.sort((a, b) => a.score - b.score);
    tableData.net = tableData.net.sort((a, b) => a.score - b.score);
    return tableData;
  }

  const getPlaces = (scoreType: ScoreType, winners: CalcuttaWinner[]) => {
    const places: Place[] = [];
    const availablePlaces =
      scoreType === ScoreType.NET ? netPayouts.length : grossPayouts.length;
    for (let place = 1; place <= availablePlaces; place++) {
      const filteredWinners = winners.filter(
        (winner) => winner.scoreType === scoreType && winner.place === place,
      );
      if (filteredWinners.length > 0) {
        places.push({
          number: place,
          score: filteredWinners[0].score,
          winnings: Math.floor(filteredWinners[0].amount),
          winners: filteredWinners.map(
            (winner) => `${winner.aPlayer} & ${winner.bPlayer}`,
          ),
        });
      }
    }
    return places;
  };

  const CalcuttaTable = (props: CalcuttaTableProps) => {
    const { scoreType, records, ...otherProps } = props;
    const title = `${scoreType}${isSample ? ' Sample' : ''}`;

    return (
      <Stack {...otherProps}>
        <SectionTitle order={2}>{title}</SectionTitle>
        <Paper withBorder shadow="lg">
          <DataTable
            ta="left"
            fz="lg"
            withTableBorder={false}
            borderRadius="4px"
            minHeight={150}
            noRecordsText="No results yet"
            noRecordsIcon={<NoRecordsFeedback />}
            borderColor="var(--gacg-color-border)"
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
            records={records}
            fetching={calcuttaQuery.isPending}
            loaderType="bars"
            rowExpansion={{
              collapseProps: {
                transitionDuration: 400,
                animateOpacity: false,
                transitionTimingFunction: 'ease-out',
              },
              content: ({ record }) => (
                <CalcuttaScorecard
                  day={record.scorecardData.day}
                  scoreType={record.scorecardData.scoreType}
                  a={record.scorecardData.a}
                  b={record.scorecardData.b}
                />
              ),
            }}
          />
        </Paper>
      </Stack>
    );
  };

  const winners = getWinners();

  return (
    <Stack>
      <Group justify="space-between">
        <DaySelector
          value={tournamentDay}
          onChange={(day) => setTournamentDay(day as TournamentDay)}
        />
        <Group>
          <PrizePoolInput
            labelId="calcuttaPrizePool"
            value={prizePool}
            onChange={setPrizePool}
          />
          <DownloadButton
            disabled={
              isSample
                ? !calcuttaSampleQuery.isSuccess
                : !calcuttaQuery.isSuccess
            }
            aria-label="Download calcutta"
            onClick={downloadCalcutta}
          />
        </Group>
      </Group>
      <Stack gap="xl">
        {!isSample && (
          <Stack>
            <SectionTitle>Results</SectionTitle>
            <Group gap="xl" align="flex-start">
              <Podium title="Net" places={getPlaces(ScoreType.NET, winners)} />
              <Podium
                title="Gross"
                places={getPlaces(ScoreType.GROSS, winners)}
              />
            </Group>
          </Stack>
        )}
        <SectionTitle>Scores</SectionTitle>
        <CalcuttaTable
          scoreType={ScoreType.NET}
          records={calcuttaTableData.net}
        />
        <CalcuttaTable
          scoreType={ScoreType.GROSS}
          records={calcuttaTableData.gross}
        />
      </Stack>
    </Stack>
  );
}

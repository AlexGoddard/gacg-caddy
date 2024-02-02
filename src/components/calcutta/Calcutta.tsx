import { DataTable } from 'mantine-datatable';
import { useState } from 'react';
import {
  ActionIcon,
  Box,
  Group,
  GroupProps,
  Paper,
  Stack,
  StackProps,
  TableProps,
  Text,
  Title,
} from '@mantine/core';
import { IconDownload, IconGolfOff, IconTrophy } from '@tabler/icons-react';

import { Scorecard } from './Scorecard';
import { DaySelector, PrizePoolInput } from 'components/common/form-inputs';
import { SectionTitle } from 'components/common/typography';
import { DEFAULT_GRADIENT, ScoreType, TournamentDay } from 'components/constants';
import { sum, getTournamentDay } from 'components/util';
import { CalcuttaTeam, useCalcutta, useDownloadCalcutta } from 'hooks/rounds';

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

interface CalcuttaWinner {
  aPlayer: string;
  bPlayer: string;
  score: number;
  amount: number;
  place: number;
  scoreType: ScoreType;
}

interface Place {
  number: number;
  score: number;
  winnings: number;
  winners: string[];
}

interface PlaceProps extends Place, GroupProps {}

interface PodiumProps extends StackProps {
  places: Place[];
}

interface CalcuttaTableProps extends StackProps {
  scoreType: ScoreType;
  records: CalcuttaTeamData[];
}

export function Calcutta() {
  const [tournamentDay, setTournamentDay] = useState(getTournamentDay());
  const [prizePool, setPrizePool] = useState<string | number>(5000);

  const isSample = tournamentDay !== TournamentDay.SUNDAY;
  const { isSuccess, data } = useCalcutta(tournamentDay);
  const calcuttaFiles = useDownloadCalcutta(isSample);
  const calcutta = isSuccess ? data : [];

  const calcuttaTableData = getCalcuttaTableData(calcutta);

  const downloadCalcutta = () => {
    calcuttaFiles.download();
  };

  const getWinnings = (payouts: number[], teamsAlreadyPlaced: number, numTeams: number) => {
    return sum(payouts.slice(teamsAlreadyPlaced, teamsAlreadyPlaced + numTeams)) / numTeams;
  };

  const getWinners = () => {
    const winners: CalcuttaWinner[] = [];
    const netPayouts = [0.3, 0.2, 0.15, 0.1, 0.05].map((percent) => percent * Number(prizePool));
    const grossPayouts = [0.1, 0.05].map((percent) => percent * Number(prizePool));

    // The number of teams who have already placed
    let netPlaced = 0;
    let grossPlaced = 0;

    for (const netCalcuttaTeam of calcuttaTableData.net) {
      if (winners.find((winning) => winning.aPlayer === netCalcuttaTeam.aPlayer)) continue;
      if (netPlaced >= netPayouts.length) break;
      const grossWinners: CalcuttaTeamData[] = [];

      const possibleNetWinners = calcuttaTableData.net.filter(
        (possibleMatch) => possibleMatch.score === netCalcuttaTeam.score,
      );
      // Determine if each team could win more going gross
      possibleNetWinners.forEach((winner) => {
        const remainingGrossTeams = calcuttaTableData.gross.filter((possibleMatch) =>
          grossWinners.find((grossWinner) => grossWinner.aPlayer === possibleMatch.aPlayer)
            ? false
            : true,
        );
        const winnerGrossScore = calcuttaTableData.gross.find(
          (possibleMatch) => possibleMatch.aPlayer === winner.aPlayer,
        )?.score;
        remainingGrossTeams
          .slice(0, grossPayouts.length - grossWinners.length)
          .forEach((remainingGrossTeam, index) => {
            if (grossWinners.find((grossWinner) => grossWinner.aPlayer === winner.aPlayer)) {
              return;
            }
            if (remainingGrossTeam.score === winnerGrossScore) {
              const possibleGrossWinners = remainingGrossTeams.filter(
                (possibleMatch) => possibleMatch.score === remainingGrossTeam.score,
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
                grossWinners.push({ ...winner, ...{ score: winnerGrossScore } });
              }
            }
          });
      });

      // Filter out teams that went gross
      const netWinners = possibleNetWinners.filter((winner) =>
        grossWinners.find((grossWinner) => grossWinner.aPlayer === winner.aPlayer) ? false : true,
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
      const remainingGrossTeams = calcuttaTableData.gross.filter((possibleMatch) =>
        winners.find((winning) => winning.aPlayer === possibleMatch.aPlayer) ? false : true,
      );
      for (const grossTeam of remainingGrossTeams) {
        if (winners.find((winning) => winning.aPlayer === grossTeam.aPlayer)) continue;
        if (grossPlaced >= grossPayouts.length) break;

        const grossWinners = remainingGrossTeams.filter(
          (possibleMatch) => possibleMatch.score === grossTeam.score,
        );
        const grossWinnings = getWinnings(grossPayouts, grossPlaced, grossWinners.length);
        grossWinners.map((grossWinner) => {
          if (
            winners.find(
              (winner) =>
                winner.scoreType === ScoreType.GROSS && winner.score === grossWinner.score,
            )
          ) {
            winners.find(
              (winner) =>
                winner.scoreType === ScoreType.GROSS && winner.score === grossWinner.score,
            )!.amount = getWinnings(grossPayouts, grossPlaced - 1, grossWinners.length + 1);
            winners.push({
              aPlayer: grossWinner.aPlayer,
              bPlayer: grossWinner.bPlayer,
              score: grossWinner.score,
              amount: getWinnings(grossPayouts, grossPlaced - 1, grossWinners.length + 1),
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

  function getCalcuttaTableData(calcutta: CalcuttaTeam[]) {
    const tableData: CalcuttaTableData = { gross: [], net: [] };
    calcutta.map((calcuttaTeam, index) => {
      Object.values(ScoreType).map((scoreType) => {
        tableData[scoreType].push({
          id: index,
          aPlayer: calcuttaTeam.a.name,
          bPlayer: calcuttaTeam.b.name,
          score: sum(calcuttaTeam[scoreType]),
          scorecardData: {
            a: {
              name: calcuttaTeam.a.name,
              scores: calcuttaTeam.a[scoreType] ? calcuttaTeam.a[scoreType]! : [],
            },
            b: {
              name: calcuttaTeam.b.name,
              scores: calcuttaTeam.b[scoreType] ? calcuttaTeam.b[scoreType]! : [],
            },
            teamScores: calcuttaTeam[scoreType],
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
    const availablePlaces = scoreType === ScoreType.NET ? [1, 2, 3, 4, 5] : [1, 2, 3];
    return availablePlaces
      .map((place) => {
        const filteredWinners = winners.filter(
          (winner) => winner.scoreType === scoreType && winner.place === place,
        );
        if (filteredWinners.length > 0) {
          return {
            number: place,
            score: filteredWinners[0].score,
            winnings: Math.floor(filteredWinners[0].amount),
            winners: filteredWinners.map((winner) => `${winner.aPlayer} & ${winner.bPlayer}`),
          };
        }
      })
      .filter((place): place is Place => !!place);
  };

  const Trophy = ({ place }: { place: number }) => {
    const iconSize = '2.125rem';
    const trophyClass = 'trophy';
    switch (place) {
      case 1:
        return <IconTrophy size={iconSize} color="#FFD700" className={trophyClass} />;
      case 2:
        return <IconTrophy size={iconSize} color="#C0C0C0" className={trophyClass} />;
      case 3:
        return <IconTrophy size={iconSize} color="#CD7F32" className={trophyClass} />;
      default:
        return (
          <Title order={2} className={trophyClass}>
            {place}
          </Title>
        );
    }
  };

  const Place = (props: PlaceProps) => {
    const { number, score, winnings, winners, ...otherProps } = props;

    return (
      <Group align="flex-start" {...otherProps}>
        <Trophy place={number} />
        <Stack ta="left" gap={0}>
          <Text fw="bold" fz="lg">
            {score}{' '}
            <Text span inherit c="indigo">
              (${winnings})
            </Text>
          </Text>

          {winners.map((winner) => (
            <Text fz="lg" key={`winner-${winner}`}>
              {winner}
            </Text>
          ))}
        </Stack>
      </Group>
    );
  };

  const Podium = (props: PodiumProps) => {
    const { title, places, ...otherProps } = props;

    return (
      <Stack {...otherProps}>
        <Title order={3}>{title}</Title>
        <Paper withBorder shadow="lg" p="xl" gap="lg" component={Stack}>
          {places.map((place) => (
            <Place
              number={place.number}
              score={place.score}
              winnings={place.winnings}
              winners={place.winners}
              key={`place-${place.number}`}
            />
          ))}
        </Paper>
      </Stack>
    );
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
            records={records}
            rowExpansion={{
              collapseProps: {
                transitionDuration: 400,
                animateOpacity: false,
                transitionTimingFunction: 'ease-out',
              },
              content: ({ record }) => <Scorecard data={record.scorecardData} />,
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
          <PrizePoolInput labelId="calcuttaPrizePool" value={prizePool} onChange={setPrizePool} />
          <ActionIcon
            variant="gradient"
            aria-label="Download calcutta"
            gradient={DEFAULT_GRADIENT}
            onClick={downloadCalcutta}
          >
            <IconDownload />
          </ActionIcon>
        </Group>
      </Group>
      <Stack gap="xl">
        {!isSample && (
          <Stack>
            <SectionTitle>Results</SectionTitle>
            <Group justify="space-around" align="flex-start">
              <Podium title="Net" places={getPlaces(ScoreType.NET, winners)} />
              <Podium title="Gross" places={getPlaces(ScoreType.GROSS, winners)} />
            </Group>
          </Stack>
        )}
        <SectionTitle>Scores</SectionTitle>
        <CalcuttaTable scoreType={ScoreType.NET} records={calcuttaTableData.net} />
        <CalcuttaTable scoreType={ScoreType.GROSS} records={calcuttaTableData.gross} />
      </Stack>
    </Stack>
  );
}

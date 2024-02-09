import { useState } from 'react';

import { Group, Stack, Table, Title } from '@mantine/core';

import { DownloadButton } from 'components/common/controls';
import { Winnings } from 'components/common/data-display';
import { DaySelector, PrizePoolInput } from 'components/common/form-inputs';
import { ScoreType, TournamentDay } from 'components/constants';
import {
  NamedDownloadData,
  downloadZip,
  getTournamentDay,
  getTournamentYear,
} from 'components/util';

import { usePayballs } from 'hooks/rounds';

import './style.less';

const HEADERS = ['Player', 'Hole', 'Score'];
const ELIGIBLE_DAYS = [TournamentDay.FRIDAY, TournamentDay.SATURDAY];

export function Payballs() {
  const currentTournamentDay = getTournamentDay();
  const [tournamentDay, setTournamentDay] = useState(
    ELIGIBLE_DAYS.includes(currentTournamentDay) ? currentTournamentDay : TournamentDay.FRIDAY,
  );
  const [prizePool, setPrizePool] = useState<string | number>(200);
  const { isSuccess, data } = usePayballs(tournamentDay);
  const payballs = isSuccess ? data : [];

  const payballTableData = payballs.map((payballData) => ({
    scoreType: payballData.scoreType,
    elementData: {
      head: HEADERS,
      body: payballData.payballs.map((payball) => [
        payball.player,
        payball.holeNumber.toString(),
        payball.score.toString(),
      ]),
    },
  }));

  const payballTables = payballTableData.map((payballData) => ({
    scoreType: payballData.scoreType,
    element: (
      <Table
        ta="left"
        fz="xl"
        w="fit-content"
        className="payballsTable"
        data={payballData.elementData}
        key={`${payballData.scoreType}-payball-table`}
      />
    ),
  }));

  const downloadPayballs = () => {
    const fileName = `payballs-${tournamentDay}-${getTournamentYear()}.zip`;
    const toDownload: NamedDownloadData[] = payballTableData.map((payballData) => ({
      fileName: `${payballData.scoreType}.csv`,
      headers: HEADERS,
      rows: payballData.elementData.body,
    }));
    downloadZip(fileName, toDownload);
  };

  const numGrossPayballs = payballTableData
    .filter((payball) => payball.scoreType === ScoreType.GROSS)
    .reduce((sum, current) => sum + current.elementData.body.length, 0);
  const numNetPayballs = payballTableData
    .filter((payball) => payball.scoreType === ScoreType.NET)
    .reduce((sum, current) => sum + current.elementData.body.length, 0);
  // Prizes are given in $5 increments
  const grossPayballValue = Math.floor(
    Number(prizePool) / 2 / (numGrossPayballs > 0 ? numGrossPayballs : 1),
  );
  const netPayballValue = Math.floor(
    Number(prizePool) / 2 / (numNetPayballs > 0 ? numNetPayballs : 1),
  );

  return (
    <Stack>
      <Group justify="space-between">
        <DaySelector
          days={ELIGIBLE_DAYS}
          value={tournamentDay}
          onChange={(day) => setTournamentDay(day as TournamentDay)}
        />
        <Group>
          <PrizePoolInput labelId="payballsPrizePool" value={prizePool} onChange={setPrizePool} />
          <DownloadButton aria-label="Download payballs" onClick={downloadPayballs} />
        </Group>
      </Group>
      <Group align="flex-start" justify="space-around">
        <Stack gap={0}>
          <Title>Gross Payballs</Title>
          <Title c="sage" order={3}>
            <Winnings value={grossPayballValue} />
          </Title>
          {payballTables
            .filter((table) => table.scoreType === ScoreType.GROSS)
            .map((table) => table.element)}
        </Stack>
        <Stack gap={0}>
          <Title>Net Payballs</Title>
          <Title c="sage" order={3}>
            <Winnings value={netPayballValue} />
          </Title>
          {payballTables
            .filter((table) => table.scoreType === ScoreType.NET)
            .map((table) => table.element)}
        </Stack>
      </Group>
    </Stack>
  );
}

import { useState } from 'react';

import { ActionIcon, Group, Stack, Table, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import JSZip from 'jszip';

import { DaySelector, PrizePoolInput } from 'components/common/form-inputs';
import { DEFAULT_GRADIENT, ScoreType, TournamentDay } from 'components/constants';
import { getTournamentDay, getTournamentYear } from 'components/util';

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
        className="payballsTable"
        data={payballData.elementData}
        key={`${payballData.scoreType}-payball-table`}
      />
    ),
  }));

  const downloadPayballs = () => {
    const zip = new JSZip();
    payballTableData.map((payballData) => {
      const payballsFileData = [HEADERS];
      payballData.elementData.body.map((payball) => payballsFileData.push(payball));
      zip.file(
        `${payballData.scoreType}.csv`,
        new Blob([payballsFileData.map((row) => row.join(',')).join('\n')], {
          type: 'text/csv',
        }),
      );
    });
    zip.generateAsync({ type: 'blob' }).then((zippedFile) => {
      const element = document.createElement('a');
      element.href = URL.createObjectURL(zippedFile);
      element.download = `payballs-${tournamentDay}-${getTournamentYear()}.zip`;
      element.click();
    });
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
          <ActionIcon
            variant="gradient"
            aria-label="Download payballs"
            gradient={DEFAULT_GRADIENT}
            onClick={downloadPayballs}
          >
            <IconDownload />
          </ActionIcon>
        </Group>
      </Group>
      <Group align="flex-start" justify="space-around">
        <Stack gap={0}>
          <Title>Gross Payballs</Title>
          <Title c="indigo" order={3}>
            ($
            {grossPayballValue})
          </Title>
          {payballTables
            .filter((table) => table.scoreType === ScoreType.GROSS)
            .map((table) => table.element)}
        </Stack>
        <Stack gap={0}>
          <Title>Net Payballs</Title>
          <Title c="indigo" order={3}>
            ($
            {netPayballValue})
          </Title>
          {payballTables
            .filter((table) => table.scoreType === ScoreType.NET)
            .map((table) => table.element)}
        </Stack>
      </Group>
    </Stack>
  );
}

import { useState } from 'react';
import { ActionIcon, Box, Group, Stack, Table, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

import { DaySelector, PrizePoolInput } from 'components/common/form-inputs';
import { DEFAULT_GRADIENT, TournamentDay } from 'components/constants';
import { getTournamentDay, getTournamentYear } from 'components/util';
import { rounds } from 'data/rounds';

import './style.less';

export function Deuces() {
  const [tournamentDay, setTournamentDay] = useState(getTournamentDay());
  const [prizePool, setPrizePool] = useState<string | number>(100);

  const deuces = rounds.getAllDeuces(tournamentDay);
  const deuceTableData = deuces.map((deuce) => [deuce.player, deuce.hole]);
  // Prizes are given in $5 increments
  const deuceValue =
    Math.floor(Number(prizePool) / (deuceTableData.length > 0 ? deuceTableData.length : 1) / 5) * 5;

  const downloadDeuces = () => {
    const deucesFile = new Blob([deuceTableData.map((row) => row.join(',')).join('\n')], {
      type: 'text/csv',
    });
    const element = document.createElement('a');
    element.href = URL.createObjectURL(deucesFile);
    element.download = `deuces-${tournamentDay}-${getTournamentYear()}.csv`;
    element.click();
  };

  return (
    <Stack>
      <Group justify="space-between">
        <DaySelector
          value={tournamentDay}
          onChange={(day) => setTournamentDay(day as TournamentDay)}
        />
        <Group>
          <PrizePoolInput labelId="deucesPrizePool" value={prizePool} onChange={setPrizePool} />
          <ActionIcon
            variant="gradient"
            aria-label="Download deuces"
            gradient={DEFAULT_GRADIENT}
            onClick={downloadDeuces}
          >
            <IconDownload />
          </ActionIcon>
        </Group>
      </Group>
      <Box p="lg" bg="dark.8">
        <Stack gap={0}>
          <Title>Deuces</Title>
          <Title c="indigo" order={3}>
            ($
            {deuceValue})
          </Title>
        </Stack>
        <Table
          data={{
            head: ['Player', 'Hole'],
            body: deuceTableData,
          }}
          className="deuceTable"
        />
      </Box>
    </Stack>
  );
}

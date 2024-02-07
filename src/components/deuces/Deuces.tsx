import { useState } from 'react';

import { ActionIcon, Group, Stack, Table, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

import { DaySelector, PrizePoolInput } from 'components/common/form-inputs';
import { DEFAULT_GRADIENT, TournamentDay } from 'components/constants';
import { getTournamentDay, getTournamentYear } from 'components/util';

import { useDeuces } from 'hooks/rounds';

import './style.less';

const HEADERS = ['Player', 'Hole'];
const ELIGIBLE_DAYS = [TournamentDay.FRIDAY, TournamentDay.SATURDAY];

export function Deuces() {
  const currentTournamentDay = getTournamentDay();
  const [tournamentDay, setTournamentDay] = useState(
    ELIGIBLE_DAYS.includes(currentTournamentDay) ? currentTournamentDay : TournamentDay.FRIDAY,
  );
  const [prizePool, setPrizePool] = useState<string | number>(140);
  const { isSuccess, data } = useDeuces(tournamentDay);
  const deuces = isSuccess ? data : [];
  const deuceTableData = deuces.map((deuce) => [deuce.player, deuce.holeNumber.toString()]);
  const deuceValue = Math.floor(
    Number(prizePool) / (deuceTableData.length > 0 ? deuceTableData.length : 1),
  );

  const downloadDeuces = () => {
    const deucesFileData = [HEADERS];
    deuceTableData.map((deuce) => deucesFileData.push(deuce));
    const deucesFile = new Blob([deucesFileData.map((row) => row.join(',')).join('\n')], {
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
          days={ELIGIBLE_DAYS}
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
      <Stack gap={0}>
        <Title>Deuces</Title>
        <Title c="indigo" order={3}>
          ($
          {deuceValue})
        </Title>
      </Stack>
      <Table
        data={{
          head: HEADERS,
          body: deuceTableData,
        }}
        className="deuceTable"
      />
    </Stack>
  );
}

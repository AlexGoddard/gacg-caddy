import { useState } from 'react';

import { Group, Stack, Table, Title } from '@mantine/core';

import { DownloadButton } from 'components/controls/Buttons';
import { DaySelector } from 'components/controls/DaySelector';
import { Winnings } from 'components/display/typography/Winnings';
import { PrizePoolInput } from 'components/inputs/PrizePoolInput';

import { TournamentDay } from 'data/constants';
import { getTournamentDay, getTournamentYear } from 'utils/date';
import { DownloadData, downloadFile } from 'utils/file';

import { useDeuces } from 'hooks/games/useDeuces';

const HEADERS = ['Player', 'Hole'];
const ELIGIBLE_DAYS = [TournamentDay.FRIDAY, TournamentDay.SATURDAY];

export function Deuces() {
  const currentTournamentDay = getTournamentDay();
  const [tournamentDay, setTournamentDay] = useState(
    ELIGIBLE_DAYS.includes(currentTournamentDay)
      ? currentTournamentDay
      : TournamentDay.FRIDAY,
  );
  const [prizePool, setPrizePool] = useState<string | number>(140);
  const { isSuccess, data } = useDeuces(tournamentDay);
  const deuces = isSuccess ? data : [];
  const deuceTableData = deuces.map((deuce) => [
    deuce.player,
    deuce.holeNumber.toString(),
  ]);
  const deuceValue = Math.floor(
    Number(prizePool) / (deuceTableData.length > 0 ? deuceTableData.length : 1),
  );

  const downloadDeuces = () => {
    const fileName = `deuces-${tournamentDay}-${getTournamentYear()}.csv`;
    const downloadData: DownloadData = {
      headers: HEADERS,
      rows: deuceTableData,
    };
    downloadFile(fileName, downloadData);
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
          <PrizePoolInput
            labelId="deucesPrizePool"
            value={prizePool}
            onChange={setPrizePool}
          />
          <DownloadButton
            aria-label="Download deuces"
            onClick={downloadDeuces}
          />
        </Group>
      </Group>
      <Stack gap={0} title="test">
        <Title>Deuces</Title>
        <Title c="sage" order={3}>
          <Winnings value={deuceValue} />
        </Title>
      </Stack>
      <Table
        data={{
          head: HEADERS,
          body: deuceTableData,
        }}
        ta="left"
        fz="xl"
      />
    </Stack>
  );
}

import JSZip from 'jszip';
import { useState } from 'react';
import { ActionIcon, Box, Group, Stack, Title } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';

import { TitledTable } from 'components/common/data-display';
import { DaySelector } from 'components/common/form-inputs';
import { DEFAULT_GRADIENT, ScoreType, TournamentDay } from 'components/constants';
import { getTournamentDay, getTournamentYear } from 'components/util';
import { rounds } from 'data/rounds';

import './styles.less';

export function Payballs() {
  const [tournamentDay, setTournamentDay] = useState(getTournamentDay());

  const payballs = rounds.getAllPayballs(tournamentDay);

  const payballTableData = payballs.map((payballData) => {
    return {
      scoreType: payballData.scoreType,
      division: payballData.division,
      elementData: {
        head: ['Player', 'Hole', 'Score'],
        body: payballData.payballs.map((payball) => [payball.player, payball.hole, payball.score]),
      },
    };
  });

  const payballTables = payballTableData.map((payballData) => {
    return {
      scoreType: payballData.scoreType,
      division: payballData.division,
      element: (
        <TitledTable
          title={`${payballData.division.toUpperCase()} Division`}
          data={payballData.elementData}
        />
      ),
    };
  });

  const downloadPayballs = () => {
    const zip = new JSZip();
    payballTableData.map((payballData) => {
      zip.file(
        `payballs-${payballData.scoreType}-${payballData.division}.csv`,
        new Blob([payballData.elementData.body.map((row) => row.join(',')).join('\n')], {
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

  return (
    <Stack>
      <Group justify="space-between">
        <DaySelector
          value={tournamentDay}
          onChange={(day) => setTournamentDay(day as TournamentDay)}
        />
        <ActionIcon
          variant="gradient"
          aria-label="Download payballs"
          gradient={DEFAULT_GRADIENT}
          onClick={downloadPayballs}
        >
          <IconDownload />
        </ActionIcon>
      </Group>
      <Box p="lg" bg="dark.8">
        <Title>Gross Payballs</Title>
        <Group align="flex-start" justify="space-around">
          {payballTables
            .filter((table) => table.scoreType === ScoreType.GROSS)
            .map((table) => table.element)}
        </Group>
      </Box>
      <Box p="lg" bg="dark.8">
        <Title>Net Payballs</Title>
        <Group align="flex-start" justify="space-around">
          {payballTables
            .filter((table) => table.scoreType === ScoreType.NET)
            .map((table) => table.element)}
        </Group>
      </Box>
    </Stack>
  );
}

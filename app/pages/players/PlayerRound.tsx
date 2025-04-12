import { Divider, Group, Paper, PaperProps, Stack, Text, Title } from '@mantine/core';

import { TournamentDay } from 'data/constants';

import { useRounds } from 'hooks/rounds/useRounds';

interface PlayerRoundProps extends PaperProps {
  day: TournamentDay;
  playerId: number;
}

export const PlayerRound = (props: PlayerRoundProps) => {
  const { day, playerId, ...otherProps } = props;
  const { isPending, isSuccess, isError, error, data } = useRounds(day, playerId);

  return (
    <Stack gap="xxs" align="center">
      <Title order={3} tt="capitalize">
        {day}
      </Title>
      <Paper p="sm" shadow="sm" gap="xs" component={Stack} {...otherProps}>
        {isPending && <Text>Loading..</Text>}
        {isError && <Text c="blush">{error.message}</Text>}
        {isSuccess && (
          <Group>
            <Stack ta="center" gap="0">
              <Title c="marionberry">{data[0] ? data[0].gross : 0}</Title>
              <Text fw="bold">Gross</Text>
            </Stack>
            <Divider orientation="vertical" />
            <Stack ta="center" gap="0">
              <Title c="marionberry">{data[0] ? data[0].net : 0}</Title>
              <Text fw="bold">Net</Text>
            </Stack>
          </Group>
        )}
      </Paper>
    </Stack>
  );
};

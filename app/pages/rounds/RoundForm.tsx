import { ReactNode } from 'react';

import {
  Badge,
  Button,
  Fieldset,
  Grid,
  Group,
  NumberInput,
  NumberInputProps,
  Paper,
  SelectProps,
  SimpleGrid,
  Skeleton,
  Stack,
  StackProps,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';
import { useQueries } from '@tanstack/react-query';

import { DaySelector } from 'components/controls/DaySelector';
import { PlayerSelect } from 'components/inputs/PlayerSelect';

import { Division, TournamentDay } from 'data/constants';
import { getTournamentDay } from 'utils/date';
import { getGross, getIn, getNet, getOut } from 'utils/holes';

import { Hole } from 'hooks/holes/model';
import { useHolesQuery } from 'hooks/holes/useHoles';
import { Player } from 'hooks/players/model';
import { usePlayers, usePlayersQuery } from 'hooks/players/usePlayers';
import { Round } from 'hooks/rounds/model';

import './style.less';

interface HoleInputProps extends NumberInputProps {
  hole: Hole;
}

export interface RoundFormData {
  player?: Player;
  day: TournamentDay;
  previousDay?: TournamentDay;
  grossHoles: number[];
}

interface RoundFormProps extends Omit<StackProps, 'onSubmit'> {
  round?: Round;
  onSubmit: (data: RoundFormData) => Promise<void>;
}

interface SplitDataProps extends StackProps {
  topSection: ReactNode;
  bottomSection: ReactNode;
}

export function RoundForm(props: RoundFormProps) {
  const { round, onSubmit, ...otherProps } = props;
  const [playersQuery, holesQuery] = useQueries({
    queries: [usePlayersQuery, useHolesQuery],
  });
  const players = playersQuery.isSuccess ? playersQuery.data : [];
  const holes = holesQuery.isSuccess ? holesQuery.data : [];

  const initialValues = round
    ? {
        playerId: round.playerId.toString(),
        day: round.day,
        previousDay: round.day,
        grossHoles: round.grossHoles.map((hole) => ({ score: hole })),
      }
    : {
        playerId: null,
        day: getTournamentDay(),
        grossHoles: new Array(18).fill({ score: '' }),
      };

  const form = useForm({
    initialValues: initialValues,

    validate: {
      playerId: (value: string | null) =>
        value != null ? null : 'Player is required',
      grossHoles: {
        score: (value: string | number) => (Number(value) > 0 ? null : true),
      },
    },

    transformValues: (values) => ({
      player: players.find((player) => player.id === Number(values.playerId)),
      day: values.day,
      previousDay: values.previousDay,
      grossHoles: values.grossHoles.map((hole) => Number(hole.score)),
    }),
  });

  const holeInputs = holes.map((hole, index) => (
    <HoleInput
      key={`hole-${hole.holeNumber}-input`}
      hole={{
        holeNumber: hole.holeNumber,
        par: hole.par,
        handicap: hole.handicap,
      }}
      {...form.getInputProps(`grossHoles.${index}.score`)}
    />
  ));

  const selectedPlayer = form.getTransformedValues().player;

  return (
    <form
      onSubmit={form.onSubmit((values) => onSubmit(values))}
      onReset={form.onReset}
    >
      <Stack {...otherProps}>
        <DaySelector {...form.getInputProps('day')} />
        <Fieldset legend="Player Info">
          <Group>
            <PlayerSelectByDivision
              readOnly={round ? true : false}
              data-autofocus
              {...form.getInputProps('playerId')}
            />
            {selectedPlayer && (
              <>
                <Badge variant="filled">
                  Division: {selectedPlayer.division}
                </Badge>
                <Badge variant="filled">
                  Handicap: {selectedPlayer.handicap}
                </Badge>
              </>
            )}
          </Group>
        </Fieldset>
        <Skeleton visible={holesQuery.isLoading}>
          <Fieldset legend="Hole Scores">
            {holesQuery.isSuccess && (
              <Group gap="lg" justify="space-around">
                <SimpleGrid
                  cols={{ base: 3, xs: 6, sm: 9, lg: 9 }}
                  spacing="xs"
                >
                  {holeInputs}
                </SimpleGrid>
                <Grid grow columns={2}>
                  <Grid.Col span={{ xs: 2, sm: 1, lg: 1 }}>
                    <SplitData
                      topSection={getOut(
                        form.getTransformedValues().grossHoles,
                      )}
                      bottomSection="Out"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ xs: 2, sm: 1, lg: 1 }}>
                    <SplitData
                      topSection={getGross(
                        form.getTransformedValues().grossHoles,
                      )}
                      bottomSection="Gross"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ xs: 2, sm: 1, lg: 1 }}>
                    <SplitData
                      topSection={getIn(form.getTransformedValues().grossHoles)}
                      bottomSection="In"
                    />
                  </Grid.Col>
                  <Grid.Col span={{ xs: 2, sm: 1, lg: 1 }}>
                    <SplitData
                      topSection={getNet(
                        form.getTransformedValues().grossHoles,
                        selectedPlayer ? selectedPlayer.handicap : 0,
                      )}
                      bottomSection="Net"
                    />
                  </Grid.Col>
                </Grid>
              </Group>
            )}
            {holesQuery.isError && (
              <Text c="blush">{holesQuery.error.message}</Text>
            )}
          </Fieldset>
        </Skeleton>
        <Group justify="flex-end">
          <Button type="reset" variant="subtle">
            {round ? 'Reset' : 'Clear'}
          </Button>
          <Button type="submit" rightSection={<IconArrowRight size={14} />}>
            {round ? 'Update Round' : 'Add Round'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

const HoleInput = (props: HoleInputProps) => {
  const { hole, ...otherProps } = props;
  return (
    <Stack gap="0" justify="flex-start" align="center" className="hole">
      <NumberInput
        {...otherProps}
        label={hole.holeNumber}
        hideControls
        min={1}
        max={99}
        clampBehavior="strict"
        allowNegative={false}
        allowDecimal={false}
        onFocus={(e) => e.target.select()}
        classNames={{ input: 'holeInput' }}
      />
      <Paper className="holeInfo">{hole.par}</Paper>
    </Stack>
  );
};

const PlayerSelectByDivision = (props: SelectProps) => {
  const { status, error, data } = usePlayers();
  const players = status === 'success' ? data : [];

  const getPlayerItemsByDivision = (division: Division) =>
    players
      .filter((player) => player.division === division)
      .map((player) => ({
        value: player.id.toString(),
        label: player.fullName,
      }));

  return (
    <PlayerSelect
      data={Object.values(Division).map((division) => ({
        group: `${division.toUpperCase()} Division`,
        items: getPlayerItemsByDivision(division),
      }))}
      playersQueryStatus={status}
      playersQueryError={error}
      {...props}
    />
  );
};

const SplitData = (props: SplitDataProps) => {
  const { topSection, bottomSection, ...otherProps } = props;

  return (
    <Stack gap={0} className="splitData" {...otherProps}>
      <Paper>{topSection}</Paper>
      <Paper className="splitDataBottom">{bottomSection}</Paper>
    </Stack>
  );
};

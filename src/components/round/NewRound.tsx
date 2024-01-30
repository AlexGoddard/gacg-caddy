import { Badge, Button, Fieldset, Grid, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight, IconGolf } from '@tabler/icons-react';

import { DaySelector, HoleInput, PlayerInput } from 'components/common/form-inputs';
import { SplitData } from 'components/common/data-display';
import { DEFAULT_GRADIENT, TournamentDay } from 'components/constants';
import * as notifications from 'components/notifications';
import { getGross, getIn, getNet, getOut, getTournamentDay } from 'components/util';
import { holes } from 'data/holes';
import { players } from 'data/players';
import { rounds } from 'data/rounds';

import './style.less';

interface NewRoundFormData {
  playerId: number;
  day: TournamentDay;
  grossHoles: Array<number>;
}

export function NewRound({ closeModal }) {
  const form = useForm({
    initialValues: {
      playerId: null,
      day: getTournamentDay(),
      grossHoles: new Array(18).fill({ score: '' }),
    },

    validate: {
      playerId: (value) => (value != null ? null : 'Player is required'),
      grossHoles: {
        score: (value) => (Number(value) > 0 ? null : true),
      },
    },

    transformValues: (values) => ({
      playerId: Number(values.playerId),
      day: values.day,
      grossHoles: values.grossHoles.map((hole) => Number(hole.score)),
    }),
  });

  const onSubmit = async (data: NewRoundFormData) => {
    const player = players.getPlayerName(data.playerId);
    const id = notifications.loading('Adding round..', `Player: ${player}`);

    rounds
      .saveRound({
        playerId: data.playerId,
        day: data.day,
        grossHoles: data.grossHoles,
      })
      .then((saveResult) => {
        if (saveResult === true) {
          const message = `Saved round for ${player}`;
          notifications.updateSuccess(id, message);
          closeModal();
        } else {
          const message = `Failed to save round for ${player}}`;
          notifications.updateFailure(id, message);
        }
      });
  };

  const holeInputs = form.values.grossHoles.map((_, index) => (
    <HoleInput
      key={`hole-${index + 1}-input`}
      hole={{
        holeNumber: holes.getNumbers()[index],
        par: holes.getPars()[index],
        handicap: holes.getHandicaps()[index],
      }}
      {...form.getInputProps(`grossHoles.${index}.score`)}
    />
  ));

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))} onReset={form.onReset}>
      <Stack>
        <DaySelector {...form.getInputProps('day')} />
        <Fieldset legend="Player Info">
          <Group>
            <PlayerInput {...form.getInputProps('playerId')} />
            {form.values.playerId && (
              <>
                <Badge variant="gradient" gradient={DEFAULT_GRADIENT}>
                  Division: {players.getDivision(form.getTransformedValues().playerId)}
                </Badge>
                <Badge variant="gradient" gradient={DEFAULT_GRADIENT}>
                  Handicap: {players.getHandicap(form.getTransformedValues().playerId)}
                </Badge>
              </>
            )}
          </Group>
        </Fieldset>
        <Fieldset legend="Hole Scores">
          <Group gap="lg" justify="space-around">
            <SimpleGrid cols={{ base: 3, xs: 6, sm: 9, lg: 9 }} spacing="xs">
              {holeInputs}
            </SimpleGrid>
            <Grid grow columns={2}>
              <Grid.Col span={{ xs: 2, sm: 1, lg: 1 }}>
                <SplitData
                  topSection={getOut(form.getTransformedValues().grossHoles)}
                  bottomSection="Out"
                />
              </Grid.Col>
              <Grid.Col span={{ xs: 2, sm: 1, lg: 1 }}>
                <SplitData
                  topSection={getGross(form.getTransformedValues().grossHoles)}
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
                    players.getHandicap(form.getTransformedValues().playerId),
                  )}
                  bottomSection="Net"
                />
              </Grid.Col>
            </Grid>
          </Group>
        </Fieldset>
        <Group justify="flex-end">
          <Button type="reset" variant="subtle">
            Clear
          </Button>
          <Button
            type="submit"
            variant="gradient"
            gradient={DEFAULT_GRADIENT}
            rightSection={<IconArrowRight size={14} />}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export const NewRoundTitle = () => {
  return (
    <Text variant="gradient" gradient={DEFAULT_GRADIENT} fz="xl" fw="bold">
      New Round
      <IconGolf className="headerIcon" />
    </Text>
  );
};

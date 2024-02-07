import {
  Badge,
  Button,
  Fieldset,
  Grid,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  StackProps,
  Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight, IconGolf } from '@tabler/icons-react';
import { useMutation, useQueries } from '@tanstack/react-query';

import * as notifications from 'components/notifications';
import { SplitData } from 'components/common/data-display';
import { DaySelector, HoleInput, PlayerInput } from 'components/common/form-inputs';
import { DEFAULT_GRADIENT, TournamentDay } from 'components/constants';
import { getGross, getIn, getNet, getOut, getTournamentDay } from 'components/util';

import { useHolesQuery } from 'hooks/holes';
import { Player, usePlayersQuery } from 'hooks/players';
import { Round, saveRound } from 'hooks/rounds';

import './style.less';

interface NewRoundFormData {
  player?: Player;
  day: TournamentDay;
  grossHoles: Array<number>;
}

interface NewRoundProps extends StackProps {
  closeModal: () => void;
}

export function NewRound(props: NewRoundProps) {
  const { closeModal, ...otherProps } = props;
  const mutation = useMutation({
    mutationFn: (newRound: Round) => saveRound(newRound),
  });
  const [playersQuery, holesQuery] = useQueries({ queries: [usePlayersQuery, useHolesQuery] });
  const players = playersQuery.isSuccess ? playersQuery.data : [];
  const holes = holesQuery.isSuccess ? holesQuery.data : [];

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
      player: players.find((player) => player.id === Number(values.playerId)),
      day: values.day,
      grossHoles: values.grossHoles.map((hole) => Number(hole.score)),
    }),
  });

  const onSubmit = async (data: NewRoundFormData) => {
    if (data.player) {
      const loadingNotification = notifications.loading('Saving round..');

      mutation.mutate(
        { playerId: data.player.id, day: data.day, grossHoles: data.grossHoles },
        {
          onSuccess: async (response) => {
            if (response === true) {
              notifications.updateSuccess(loadingNotification, 'Saved round');
              closeModal();
            } else {
              notifications.updateFailure(loadingNotification, 'Failed to save round');
            }
          },
          onError: async () => {
            notifications.updateFailure(loadingNotification, 'Failed to save round');
          },
        },
      );
    } else {
      // If player is removed between selecting and submitting
      form.setErrors({ playerId: 'Selected player no longer exists' });
    }
  };

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
    <form onSubmit={form.onSubmit((values) => onSubmit(values))} onReset={form.onReset}>
      <Stack {...otherProps}>
        <DaySelector {...form.getInputProps('day')} />
        <Fieldset legend="Player Info">
          <Group>
            <PlayerInput data-autofocus {...form.getInputProps('playerId')} />
            {selectedPlayer && (
              <>
                <Badge variant="gradient" gradient={DEFAULT_GRADIENT}>
                  Division: {selectedPlayer.division}
                </Badge>
                <Badge variant="gradient" gradient={DEFAULT_GRADIENT}>
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
                        selectedPlayer ? selectedPlayer.handicap : 0,
                      )}
                      bottomSection="Net"
                    />
                  </Grid.Col>
                </Grid>
              </Group>
            )}
            {holesQuery.isError && <Text c="red">{holesQuery.error.message}</Text>}
          </Fieldset>
        </Skeleton>
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

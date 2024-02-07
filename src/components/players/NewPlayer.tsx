import {
  Button,
  Fieldset,
  Group,
  NumberInput,
  Select,
  Stack,
  StackProps,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight, IconUser } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as notifications from 'components/notifications';
import { DEFAULT_GRADIENT, Division } from 'components/constants';
import { capitalize } from 'components/util';

import { NewPlayer, savePlayer } from 'hooks/players';

import './style.less';

interface NewPlayerFormData {
  firstName: string;
  lastName: string;
  division: Division;
  handicap: number;
}

interface NewPlayerProps extends StackProps {
  closeModal: () => void;
}

export function NewPlayerForm(props: NewPlayerProps) {
  const { closeModal, ...otherProps } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newPlayer: NewPlayer) => savePlayer(newPlayer),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      division: Division.A,
      handicap: '',
    },

    validate: {
      firstName: (value) => (value != '' ? null : 'First name is required'),
      lastName: (value) => (value != '' ? null : 'Last name is required'),
      handicap: (value) => (value != '' ? null : 'Handicap is required'),
    },

    transformValues: (values) => ({
      firstName: capitalize(values.firstName),
      lastName: capitalize(values.lastName),
      division: values.division,
      handicap: Number(values.handicap),
    }),
  });

  const onSubmit = async (data: NewPlayerFormData) => {
    const loadingNotification = notifications.loading('Saving player..');

    mutation.mutate(data, {
      onSettled: (newPlayer) => {
        if (newPlayer) {
          closeModal();
          notifications.updateSuccess(loadingNotification, 'Saved player');
        } else {
          notifications.updateFailure(loadingNotification, 'Failed to save player');
        }
      },
    });
  };

  return (
    <form onSubmit={form.onSubmit((values) => onSubmit(values))} onReset={form.onReset}>
      <Stack {...otherProps}>
        <Fieldset legend="Player Information">
          <Stack>
            <TextInput label="First Name" data-autofocus {...form.getInputProps('firstName')} />
            <TextInput label="Last Name" {...form.getInputProps('lastName')} />
            <Group justify="space-between" grow>
              <Select
                label="Division"
                placeholder="Choose division"
                allowDeselect={false}
                data={Object.values(Division).map((division) => ({
                  value: division,
                  label: division.toUpperCase(),
                }))}
                comboboxProps={{
                  transitionProps: { transition: 'pop', duration: 300 },
                }}
                {...form.getInputProps('division')}
              />
              <NumberInput
                label="Handicap"
                allowDecimal={false}
                rightSection
                {...form.getInputProps('handicap')}
              />
            </Group>
          </Stack>
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

export const NewPlayerTitle = () => {
  return (
    <Text variant="gradient" gradient={DEFAULT_GRADIENT} fz="xl" fw="bold">
      New Player
      <IconUser className="headerIcon" />
    </Text>
  );
};

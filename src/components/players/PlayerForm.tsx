import {
  Button,
  Fieldset,
  Group,
  NumberInput,
  Select,
  Stack,
  StackProps,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowRight } from '@tabler/icons-react';

import { Division } from 'components/constants';
import { capitalize } from 'components/util';

import { Player } from 'hooks/players';

import './style.less';

export interface PlayerFormData {
  firstName: string;
  lastName: string;
  division: Division;
  handicap: number;
}

interface PlayerFormProps extends Omit<StackProps, 'onSubmit'> {
  player?: Player;
  onSubmit: (data: PlayerFormData) => Promise<void>;
}

export function PlayerForm(props: PlayerFormProps) {
  const { player, onSubmit, ...otherProps } = props;

  const initialValues = player
    ? {
        firstName: player.firstName,
        lastName: player.lastName,
        division: player.division,
        handicap: player.handicap,
      }
    : {
        firstName: '',
        lastName: '',
        division: Division.A,
        handicap: '',
      };

  const form = useForm({
    initialValues: initialValues,

    validate: {
      firstName: (value) => (value != '' ? null : 'First name is required'),
      lastName: (value) => (value != '' ? null : 'Last name is required'),
      handicap: (value: string | number) => (value != '' ? null : 'Handicap is required'),
    },

    transformValues: (values) => ({
      firstName: capitalize(values.firstName),
      lastName: capitalize(values.lastName),
      division: values.division,
      handicap: Number(values.handicap),
    }),
  });

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
            {player ? 'Reset' : 'Clear'}
          </Button>
          <Button type="submit" rightSection={<IconArrowRight size={14} />}>
            {player ? 'Update Player' : 'Add Player'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

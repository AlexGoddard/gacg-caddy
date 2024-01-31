import {
  Chip,
  ChipGroupProps,
  Group,
  NumberInput,
  NumberInputProps,
  Paper,
  Select,
  SelectProps,
  Stack,
  Text,
  rem,
} from '@mantine/core';
import { IconCurrencyDollar } from '@tabler/icons-react';

import { Division, TournamentDay } from 'components/constants';
import { getFullName } from 'components/util';
import { Hole } from 'data/holes';
import { players } from 'data/players';

interface PrizePoolInputProps extends NumberInputProps {
  labelId: string;
}

interface HoleInputProps extends NumberInputProps {
  hole: Hole;
}

export const DaySelector = (props: ChipGroupProps) => {
  return (
    <Chip.Group {...props}>
      <Group justify="left">
        <Chip variant="light" value={TournamentDay.FRIDAY}>
          Friday
        </Chip>
        <Chip variant="light" value={TournamentDay.SATURDAY}>
          Saturday
        </Chip>
        <Chip variant="light" value={TournamentDay.SUNDAY}>
          Sunday
        </Chip>
      </Group>
    </Chip.Group>
  );
};

export const PrizePoolInput = (props: PrizePoolInputProps) => {
  const { labelId, ...otherProps } = props;
  return (
    <>
      <Text id={labelId}>Prize Pool</Text>
      <NumberInput
        {...otherProps}
        aria-labelledby={labelId}
        hideControls
        placeholder="enter amount"
        size="md"
        leftSection={
          <IconCurrencyDollar style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        }
        min={1}
        clampBehavior="strict"
        allowDecimal={false}
        allowNegative={false}
        thousandSeparator=","
        onFocus={(e) => e.target.select()}
        classNames={{ input: 'prizePoolInput' }}
      />
    </>
  );
};

export const HoleInput = (props: HoleInputProps) => {
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

export const PlayerInput = (props: SelectProps) => {
  const playerList = players.getPlayers();
  return (
    <Select
      aria-label="Player select"
      placeholder="Search players.."
      data={[
        {
          group: 'A Division',
          items: playerList
            .filter((player) => player.division === Division.A)
            .map((player) => {
              return {
                value: player.id.toString(),
                label: getFullName(player.firstName, player.lastName),
              };
            }),
        },
        {
          group: 'B Division',
          items: playerList
            .filter((player) => player.division === Division.B)
            .map((player) => {
              return {
                value: player.id.toString(),
                label: getFullName(player.firstName, player.lastName),
              };
            }),
        },
      ]}
      comboboxProps={{
        transitionProps: { transition: 'pop', duration: 300 },
      }}
      searchable
      clearable
      {...props}
    />
  );
};

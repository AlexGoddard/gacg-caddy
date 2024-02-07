import {
  Chip,
  ChipGroupProps,
  Group,
  Loader,
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

import { ErrorFeedback } from 'components/common/feedback';
import { Division, TournamentDay } from 'components/constants';

import { Hole } from 'hooks/holes';
import { usePlayers } from 'hooks/players';

import './style.less';

interface DaySelectorProps extends ChipGroupProps {
  days?: TournamentDay[];
}

interface PrizePoolInputProps extends NumberInputProps {
  labelId: string;
}

interface HoleInputProps extends NumberInputProps {
  hole: Hole;
}

export const DaySelector = (props: DaySelectorProps) => {
  const { days, ...otherProps } = props;
  const availableDays = days
    ? days
    : [TournamentDay.FRIDAY, TournamentDay.SATURDAY, TournamentDay.SUNDAY];
  return (
    <Chip.Group {...otherProps}>
      <Group justify="left">
        {availableDays.map((day) => (
          <Chip variant="light" value={day} tt="capitalize" key={`${day}-selector`}>
            {day}
          </Chip>
        ))}
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
  const { isPending, isSuccess, isError, error, data } = usePlayers();
  const players = isSuccess ? data : [];

  const getPlayerItemsByDivision = (division: Division) =>
    players
      .filter((player) => player.division === division)
      .map((player) => ({
        value: player.id.toString(),
        label: player.fullName,
      }));

  return (
    <Group gap="xs">
      <Select
        aria-label="Player select"
        placeholder={isPending ? 'Loading players..' : 'Search players..'}
        disabled={!isSuccess}
        data={Object.values(Division).map((division) => ({
          group: `${division.toUpperCase()} Division`,
          items: getPlayerItemsByDivision(division),
        }))}
        comboboxProps={{
          transitionProps: { transition: 'pop', duration: 300 },
        }}
        searchable
        clearable
        selectFirstOptionOnChange
        {...props}
      />
      {isPending && <Loader size="xs" />}
      {isError && <ErrorFeedback label={error.message} />}
    </Group>
  );
};

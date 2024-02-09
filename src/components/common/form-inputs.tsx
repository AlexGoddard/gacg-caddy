import {
  Chip,
  ChipGroupProps,
  Group,
  Loader,
  NumberInput,
  NumberInputProps,
  Select,
  SelectProps,
  Text,
  rem,
} from '@mantine/core';
import { IconCurrencyDollar } from '@tabler/icons-react';

import { ErrorFeedback } from 'components/common/feedback';
import { TournamentDay } from 'components/constants';

import './style.less';

interface DaySelectorProps extends ChipGroupProps {
  days?: TournamentDay[];
}

interface PlayerSelectProps extends SelectProps {
  playersQueryStatus: 'error' | 'success' | 'pending';
  playersQueryError: Error | null;
}

interface PrizePoolInputProps extends NumberInputProps {
  labelId: string;
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
          <Chip variant="filled" value={day} tt="capitalize" key={`${day}-selector`}>
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

export const PlayerSelect = (props: PlayerSelectProps) => {
  const { playersQueryStatus, playersQueryError, ...otherProps } = props;
  return (
    <Group gap="xs">
      <Select
        aria-label="Player select"
        placeholder={playersQueryStatus === 'pending' ? 'Loading players..' : 'Search players..'}
        disabled={playersQueryStatus !== 'success'}
        comboboxProps={{
          transitionProps: { transition: 'pop', duration: 300 },
        }}
        searchable
        clearable
        selectFirstOptionOnChange
        {...otherProps}
      />
      {playersQueryStatus === 'pending' && <Loader size="xs" />}
      {playersQueryStatus === 'error' && <ErrorFeedback label={playersQueryError!.message} />}
    </Group>
  );
};

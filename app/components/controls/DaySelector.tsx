import { Chip, ChipGroupProps, Group } from '@mantine/core';

import { TournamentDay } from 'data/constants';

interface DaySelectorProps extends ChipGroupProps {
  days?: TournamentDay[];
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
          <Chip
            variant="filled"
            value={day}
            tt="capitalize"
            key={`${day}-selector`}
          >
            {day}
          </Chip>
        ))}
      </Group>
    </Chip.Group>
  );
};

import { Chip, Group, NumberInput, Paper, Select, Stack } from '@mantine/core';

import { players } from 'data/players';

export const DaySelector = (props) => {
  return (
    <Chip.Group {...props}>
      <Group justify="left">
        <Chip variant="light" value="friday">
          Friday
        </Chip>
        <Chip variant="light" value="saturday">
          Saturday
        </Chip>
        <Chip variant="light" value="sunday">
          Sunday
        </Chip>
      </Group>
    </Chip.Group>
  );
};

export const HoleInput = (props) => {
  const { hole, ...otherProps } = props;
  return (
    <Stack gap="0" justify="flex-start" align="center" className="hole">
      <NumberInput
        {...otherProps}
        label={hole.number}
        hideControls
        classNames={{ input: 'holeInput' }}
        min={1}
        max={99}
        allowNegative={false}
        allowDecimal={false}
        onFocus={(e) => e.target.select()}
      />
      <Paper className="holeInfo">{hole.par}</Paper>
    </Stack>
  );
};

export const PlayerInput = (props) => {
  return (
    <Select
      aria-label="Player select"
      placeholder="Search players.."
      data={[
        {
          group: 'A Division',
          items: players.getNames('A'),
        },
        {
          group: 'B Division',
          items: players.getNames('B'),
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

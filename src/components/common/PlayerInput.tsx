import { Select } from '@mantine/core';
import { players } from 'data/players';

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

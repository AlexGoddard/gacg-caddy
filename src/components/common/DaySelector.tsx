import { Chip, Group } from '@mantine/core';

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

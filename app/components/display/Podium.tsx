import {
  Group,
  GroupProps,
  Paper,
  Stack,
  StackProps,
  Text,
  Title,
} from '@mantine/core';
import { IconTrophy } from '@tabler/icons-react';

import './style.less';
import { Winnings } from './typography/Winnings';

export interface Place {
  number: number;
  score: number;
  winnings?: number;
  winners: string[];
}

interface PlaceProps extends Place, GroupProps {}

interface PodiumProps extends StackProps {
  places: Place[];
}

export const Podium = (props: PodiumProps) => {
  const { title, places, ...otherProps } = props;

  const Trophy = ({ place }: { place: number }) => {
    const iconSize = '2.125rem';
    const trophyClass = 'trophy';
    switch (place) {
      case 1:
        return (
          <IconTrophy
            size={iconSize}
            color="var(--mantine-color-beach-4)"
            className={trophyClass}
          />
        );
      case 2:
        return (
          <IconTrophy
            size={iconSize}
            color="var(--mantine-color-snow-2)"
            className={trophyClass}
          />
        );
      case 3:
        return (
          <IconTrophy
            size={iconSize}
            color="var(--mantine-color-sunset-4)"
            className={trophyClass}
          />
        );
      default:
        return (
          <Title order={2} className={trophyClass}>
            {place}
          </Title>
        );
    }
  };

  const Place = (props: PlaceProps) => {
    const { number, score, winnings, winners, ...otherProps } = props;

    return (
      <Group align="flex-start" {...otherProps}>
        <Trophy place={number} />
        <Stack ta="left" gap={0}>
          <Text fw="bold" fz="lg">
            {score}{' '}
            {winnings && (
              <Text span inherit c="sage">
                <Winnings value={winnings} />
              </Text>
            )}
          </Text>

          {winners.map((winner) => (
            <Text fz="lg" key={`winner-${winner}`}>
              {winner}
            </Text>
          ))}
        </Stack>
      </Group>
    );
  };

  return (
    <Stack {...otherProps}>
      <Title order={3}>{title}</Title>
      <Paper withBorder shadow="lg" p="xl" gap="lg" component={Stack}>
        {places.map((place) => (
          <Place
            number={place.number}
            score={place.score}
            winnings={place.winnings}
            winners={place.winners}
            key={`place-${place.number}`}
          />
        ))}
      </Paper>
    </Stack>
  );
};

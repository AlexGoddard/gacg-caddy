import { Avatar, Badge, Group, GroupProps, Stack, Title, TitleOrder } from '@mantine/core';

import { Player } from 'hooks/players';

interface PlayerInfoProps extends GroupProps {
  size: 'md' | 'xl';
  player: Player;
}

export const PlayerInfo = (props: PlayerInfoProps) => {
  const { player, size, ...otherProps } = props;
  const sizes = {
    md: {
      groupGap: 'sm',
      avatarSize: 'lg',
      stackGap: 'xxs',
      titleOrder: 3,
      badgeGroupGap: 'xs',
      badgeSize: 'md',
    },
    xl: {
      groupGap: 'md',
      avatarSize: 'xl',
      stackGap: 'xs',
      titleOrder: 1,
      badgeGroupGap: 'sm',
      badgeSize: 'xl',
    },
  };

  const infoSize = sizes[size];
  return (
    <Group gap={infoSize.groupGap} {...otherProps}>
      <Avatar size={infoSize.avatarSize} color="cyprus" variant="light">
        {player.firstName[0]}
        {player.lastName[0]}
      </Avatar>
      <Stack gap={infoSize.stackGap}>
        <Title ta="left" order={infoSize.titleOrder as TitleOrder}>
          {player.fullName}
        </Title>
        <Group gap={infoSize.badgeGroupGap}>
          <Badge size={infoSize.badgeSize} color="dew" variant="filled">
            {player.division} Division
          </Badge>
          <Badge size={infoSize.badgeSize} color="marionberry" variant="filled">
            Handicap: {player.handicap}
          </Badge>
        </Group>
      </Stack>
    </Group>
  );
};

import { StackProps, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';

import * as notifications from 'components/feedback/notifications';

import { Player } from 'hooks/players/model';
import { useUpdatePlayer } from 'hooks/players/useUpdatePlayer';

import { PlayerForm, PlayerFormData } from './PlayerForm';
import './style.less';

interface EditPlayerFormProps extends Omit<StackProps, 'onSubmit'> {
  player: Player;
  closeModal: () => void;
}

export function EditPlayerForm(props: EditPlayerFormProps) {
  const { player, closeModal, ...otherProps } = props;

  const mutation = useUpdatePlayer();

  const onSubmit = async (data: PlayerFormData) => {
    const loadingNotification = notifications.loading('Updating player..');

    mutation.mutate(
      { id: player.id, ...data },
      {
        onSettled: (updatedPlayer) => {
          if (updatedPlayer) {
            closeModal();
            notifications.updateSuccess(loadingNotification, 'Updated player');
          } else {
            notifications.updateFailure(
              loadingNotification,
              'Failed to update player',
            );
          }
        },
      },
    );
  };

  return <PlayerForm player={player} onSubmit={onSubmit} {...otherProps} />;
}

export const EditPlayerFormTitle = () => {
  return (
    <Text fz="xl" fw="bold">
      Update Player
      <IconUser className="headerIcon" />
    </Text>
  );
};

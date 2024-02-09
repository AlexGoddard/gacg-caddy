import { StackProps, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as notifications from 'components/notifications';
import { PlayerForm, PlayerFormData } from 'components/players/PlayerForm';

import { FormPlayer, Player, updatePlayer } from 'hooks/players';

import './style.less';

interface EditPlayerFormProps extends Omit<StackProps, 'onSubmit'> {
  player: Player;
  closeModal: () => void;
}

export function EditPlayerForm(props: EditPlayerFormProps) {
  const { player, closeModal, ...otherProps } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (editedPlayer: FormPlayer) => updatePlayer(editedPlayer),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });

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
            notifications.updateFailure(loadingNotification, 'Failed to update player');
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

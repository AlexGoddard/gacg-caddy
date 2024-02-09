import { StackProps, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as notifications from 'components/notifications';
import { PlayerForm, PlayerFormData } from 'components/players/PlayerForm';

import { FormPlayer, createPlayer } from 'hooks/players';

import './style.less';

interface NewPlayerFormProps extends Omit<StackProps, 'onSubmit'> {
  closeModal: () => void;
  setActivePlayer: React.Dispatch<React.SetStateAction<string | null>>;
}

export function NewPlayerForm(props: NewPlayerFormProps) {
  const { closeModal, setActivePlayer, ...otherProps } = props;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (newPlayer: FormPlayer) => createPlayer(newPlayer),
    onSuccess: (newPlayer) => setActivePlayer(newPlayer.id.toString()),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });

  const onSubmit = async (data: PlayerFormData) => {
    const loadingNotification = notifications.loading('Saving player..');

    mutation.mutate(data, {
      onSettled: (newPlayer) => {
        if (newPlayer) {
          closeModal();
          notifications.updateSuccess(loadingNotification, 'Saved player');
        } else {
          notifications.updateFailure(loadingNotification, 'Failed to save player');
        }
      },
    });
  };

  return <PlayerForm onSubmit={onSubmit} {...otherProps} />;
}

export const NewPlayerFormTitle = () => {
  return (
    <Text fz="xl" fw="bold">
      New Player
      <IconUser className="headerIcon" />
    </Text>
  );
};

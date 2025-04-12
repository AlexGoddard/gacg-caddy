import { StackProps, Text } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';

import * as notifications from 'components/feedback/notifications';

import { useCreatePlayer } from 'hooks/players/useCreatePlayer';

import { PlayerForm, PlayerFormData } from './PlayerForm';
import './style.less';

interface NewPlayerFormProps extends Omit<StackProps, 'onSubmit'> {
  closeModal: () => void;
  setActivePlayer: React.Dispatch<React.SetStateAction<string | null>>;
}

export function NewPlayerForm(props: NewPlayerFormProps) {
  const { closeModal, setActivePlayer, ...otherProps } = props;

  const createPlayerMutation = useCreatePlayer();

  const onSubmit = async (data: PlayerFormData) => {
    const loadingNotification = notifications.loading('Saving player..');

    createPlayerMutation.mutate(data, {
      onSuccess: (newPlayer) => setActivePlayer(newPlayer.id.toString()),
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

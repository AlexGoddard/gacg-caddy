import { StackProps, Text } from '@mantine/core';
import { IconGolf } from '@tabler/icons-react';

import * as notifications from 'components/feedback/notifications';

import { useCreateRound } from 'hooks/rounds/useCreateRound';

import { RoundForm, RoundFormData } from './RoundForm';
import './style.less';

interface NewRoundProps extends Omit<StackProps, 'onSubmit'> {
  closeModal: () => void;
}

export function NewRoundForm(props: NewRoundProps) {
  const { closeModal, ...otherProps } = props;

  const createRoundMutation = useCreateRound();

  const onSubmit = async (data: RoundFormData) => {
    if (data.player) {
      const loadingNotification = notifications.loading('Saving round..');

      createRoundMutation.mutate(
        {
          playerId: data.player.id,
          day: data.day,
          grossHoles: data.grossHoles,
        },
        {
          onSettled: (newRound) => {
            if (newRound) {
              closeModal();
              notifications.updateSuccess(loadingNotification, 'Saved round');
            } else {
              notifications.updateFailure(loadingNotification, 'Failed to save round');
            }
          },
        },
      );
    } else {
      notifications.showFailure('The selected player no longer exists');
    }
  };

  return <RoundForm onSubmit={onSubmit} {...otherProps} />;
}

export const NewRoundFormTitle = () => {
  return (
    <Text fz="xl" fw="bold">
      New Round
      <IconGolf className="headerIcon" />
    </Text>
  );
};

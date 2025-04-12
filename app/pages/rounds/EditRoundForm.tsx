import { StackProps, Text } from '@mantine/core';
import { IconGolf } from '@tabler/icons-react';

import * as notifications from 'components/feedback/notifications';

import { Round } from 'hooks/rounds/model';
import { useUpdateRound } from 'hooks/rounds/useUpdateRound';

import { RoundForm, RoundFormData } from './RoundForm';
import './style.less';

interface EditRoundFormProps extends Omit<StackProps, 'onSubmit'> {
  round: Round;
  closeModal: () => void;
}

export function EditRoundForm(props: EditRoundFormProps) {
  const { round, closeModal, ...otherProps } = props;

  const updateRoundMutation = useUpdateRound();

  const onSubmit = async (data: RoundFormData) => {
    if (data.player) {
      const loadingNotification = notifications.loading('Updating round..');

      updateRoundMutation.mutate(
        {
          playerId: data.player.id,
          day: data.day,
          previousDay: data.previousDay!,
          grossHoles: data.grossHoles,
        },
        {
          onSettled: (updatedRound) => {
            if (updatedRound) {
              closeModal();
              notifications.updateSuccess(loadingNotification, 'Updated round');
            } else {
              notifications.updateFailure(loadingNotification, 'Failed to update round');
            }
          },
        },
      );
    } else {
      notifications.showFailure('The selected player no longer exists');
    }
  };

  return <RoundForm round={round} onSubmit={onSubmit} {...otherProps} />;
}

export const EditRoundFormTitle = () => {
  return (
    <Text fz="xl" fw="bold">
      Update Round
      <IconGolf className="headerIcon" />
    </Text>
  );
};

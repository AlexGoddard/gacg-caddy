import { Tooltip, TooltipProps } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

import './style.css';

interface FeedbackProps extends Omit<TooltipProps, 'children'> {}

export const ErrorFeedback = (props: FeedbackProps) => {
  return (
    <Tooltip
      position="right"
      color="dark.6"
      withArrow
      transitionProps={{ transition: 'scale-x', duration: 300 }}
      {...props}
    >
      <IconExclamationCircle className="errorFeedback" />
    </Tooltip>
  );
};

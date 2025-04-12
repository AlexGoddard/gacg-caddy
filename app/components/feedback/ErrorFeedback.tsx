import { Tooltip, TooltipProps } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

import './style.less';

type ErrorFeedbackProps = Omit<TooltipProps, 'children'>;

export const ErrorFeedback = (props: ErrorFeedbackProps) => {
  return (
    <Tooltip
      position="right"
      color="slate.6"
      withArrow
      transitionProps={{ transition: 'scale-x', duration: 300 }}
      {...props}
    >
      <IconExclamationCircle className="errorFeedback" />
    </Tooltip>
  );
};

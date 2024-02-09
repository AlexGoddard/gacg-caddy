import { Box, BoxProps, Tooltip, TooltipProps } from '@mantine/core';
import { IconExclamationCircle, IconGolfOff } from '@tabler/icons-react';

import './style.less';

interface FeedbackProps extends Omit<TooltipProps, 'children'> {}

export const ErrorFeedback = (props: FeedbackProps) => {
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

export const NoRecordsFeedback = (props: BoxProps) => (
  <Box className="noRecordsBox" {...props}>
    <IconGolfOff size={24} />
  </Box>
);

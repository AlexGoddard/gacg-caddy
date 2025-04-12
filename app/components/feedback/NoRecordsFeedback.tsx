import { Box, BoxProps } from '@mantine/core';
import { IconGolfOff } from '@tabler/icons-react';

import './style.less';

export const NoRecordsFeedback = (props: BoxProps) => (
  <Box className="noRecordsBox" {...props}>
    <IconGolfOff size={24} />
  </Box>
);

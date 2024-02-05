import { ReactNode } from 'react';
import { Paper, Stack, StackProps } from '@mantine/core';

import './style.css';

interface SplitDataProps extends StackProps {
  topSection: ReactNode;
  bottomSection: ReactNode;
}

export const SplitData = (props: SplitDataProps) => {
  const { topSection, bottomSection, ...otherProps } = props;

  return (
    <Stack gap={0} className="splitData" {...otherProps}>
      <Paper>{topSection}</Paper>
      <Paper className="splitDataBottom">{bottomSection}</Paper>
    </Stack>
  );
};

import { ReactNode } from 'react';

import { NumberFormatter, NumberFormatterProps, Paper, Stack, StackProps } from '@mantine/core';

import './style.less';

interface SplitDataProps extends StackProps {
  topSection: ReactNode;
  bottomSection: ReactNode;
}

export const Winnings = (props: NumberFormatterProps) => (
  <NumberFormatter prefix="$" thousandSeparator {...props} />
);

export const SplitData = (props: SplitDataProps) => {
  const { topSection, bottomSection, ...otherProps } = props;

  return (
    <Stack gap={0} className="splitData" {...otherProps}>
      <Paper>{topSection}</Paper>
      <Paper className="splitDataBottom">{bottomSection}</Paper>
    </Stack>
  );
};

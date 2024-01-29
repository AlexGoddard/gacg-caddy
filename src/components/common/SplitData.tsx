import { Paper, Stack } from '@mantine/core';

export const SplitData = (props) => {
  const { topSection, bottomSection, ...otherProps } = props;

  return (
    <Stack gap={0} className="splitData" {...otherProps}>
      <Paper>{topSection}</Paper>
      <Paper className="splitDataBottom">{bottomSection}</Paper>
    </Stack>
  );
};

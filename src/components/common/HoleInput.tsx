import { NumberInput, Paper, Stack } from '@mantine/core';

export const HoleInput = (props) => {
  const { hole, ...otherProps } = props;
  return (
    <Stack gap="0" justify="flex-start" align="center" className="hole">
      <NumberInput
        {...otherProps}
        label={hole.number}
        hideControls
        classNames={{ input: 'holeInput' }}
        min={1}
        max={99}
        allowNegative={false}
        allowDecimal={false}
        onFocus={(e) => e.target.select()}
      />
      <Paper className="holeInfo">{hole.par}</Paper>
    </Stack>
  );
};

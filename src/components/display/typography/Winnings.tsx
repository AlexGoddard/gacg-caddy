import { NumberFormatter, NumberFormatterProps } from '@mantine/core';

export const Winnings = (props: NumberFormatterProps) => (
  <NumberFormatter prefix="$" thousandSeparator {...props} />
);

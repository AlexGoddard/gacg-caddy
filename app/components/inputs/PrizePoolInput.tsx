import { NumberInput, NumberInputProps, Text, rem } from '@mantine/core';
import { IconCurrencyDollar } from '@tabler/icons-react';

interface PrizePoolInputProps extends NumberInputProps {
  labelId: string;
}

export const PrizePoolInput = (props: PrizePoolInputProps) => {
  const { labelId, ...otherProps } = props;
  return (
    <>
      <Text id={labelId}>Prize Pool</Text>
      <NumberInput
        {...otherProps}
        aria-labelledby={labelId}
        hideControls
        placeholder="enter amount"
        size="md"
        leftSection={
          <IconCurrencyDollar style={{ width: rem(20), height: rem(20) }} stroke={1.5} />
        }
        min={1}
        clampBehavior="strict"
        allowDecimal={false}
        allowNegative={false}
        thousandSeparator=","
        onFocus={(e) => e.target.select()}
      />
    </>
  );
};

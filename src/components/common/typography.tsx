import { Title, TitleProps } from '@mantine/core';

export const SectionTitle = (props: TitleProps) => {
  const { children, ...otherProps } = props;
  return (
    <Title tt="capitalize" ta="left" {...otherProps}>
      {children}
    </Title>
  );
};

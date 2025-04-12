import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { IconDownload, IconPlus } from '@tabler/icons-react';

interface CustomButtonProps
  extends ActionIconProps,
    ElementProps<'button', keyof ActionIconProps> {}

export const AddButton = (props: CustomButtonProps) => (
  <ActionIcon {...props}>
    <IconPlus />
  </ActionIcon>
);

export const DownloadButton = (props: CustomButtonProps) => (
  <ActionIcon size="lg" {...props}>
    <IconDownload />
  </ActionIcon>
);

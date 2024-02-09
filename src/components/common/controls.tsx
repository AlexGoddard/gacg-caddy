import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { IconDownload, IconPlus, IconTrash } from '@tabler/icons-react';

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

export const DeleteButton = (props: CustomButtonProps) => (
  <ActionIcon variant="light" color="blush" {...props}>
    <IconTrash />
  </ActionIcon>
);

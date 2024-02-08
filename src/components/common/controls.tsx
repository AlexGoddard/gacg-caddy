import { ActionIcon, ActionIconProps, ElementProps } from '@mantine/core';
import { IconDownload, IconPlus, IconTrash } from '@tabler/icons-react';

interface CustomButtonProps
  extends ActionIconProps,
    ElementProps<'button', keyof ActionIconProps> {}

export const AddButton = (props: CustomButtonProps) => (
  <ActionIcon variant="gradient" {...props}>
    <IconPlus />
  </ActionIcon>
);

export const DownloadButton = (props: CustomButtonProps) => (
  <ActionIcon size="lg" variant="gradient" {...props}>
    <IconDownload />
  </ActionIcon>
);

export const DeleteButton = (props: CustomButtonProps) => (
  <ActionIcon variant="light" color="red" {...props}>
    <IconTrash />
  </ActionIcon>
);

import { rem } from '@mantine/core';
import { NotificationData, notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

const baseNotification = (props: NotificationData) => {
  return notifications.show({
    ...props,
  });
};

export const loading = (title: string, message: string) => {
  return baseNotification({
    loading: true,
    title: title,
    message: message,
    autoClose: false,
    withCloseButton: false,
  });
};

export const updateSuccess = (id: string, message: string) => {
  notifications.update({
    id,
    title: 'Success!',
    message: message,
    icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
    loading: false,
    autoClose: 3000,
    withCloseButton: true,
    color: 'teal',
  });
};

export const updateFailure = (id: string, message: string) => {
  notifications.update({
    id,
    title: 'Oops!',
    message: message,
    icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
    loading: false,
    autoClose: 5000,
    withCloseButton: true,
    color: 'red',
  });
};

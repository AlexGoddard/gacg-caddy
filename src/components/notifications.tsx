import { rem } from '@mantine/core';
import { NotificationData, notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';

enum NotificationType {
  SHOW = 'show',
  UPDATE = 'update',
}

const showNotification = (props: NotificationData) => {
  return notifications.show({
    ...props,
  });
};

const updateNotification = (props: NotificationData) => {
  const defaults = { loading: false, autoClose: 3000, withCloseButton: true };
  return notifications.update({
    ...defaults,
    ...props,
  });
};

const success = (notificationType: NotificationType, props: NotificationData) => {
  const defaults = {
    title: 'Success!',
    icon: <IconCheck style={{ width: rem(20), height: rem(20) }} />,
    color: 'teal',
  };
  const mergedProps = { ...defaults, ...props };
  if (notificationType === NotificationType.SHOW) {
    return showNotification(mergedProps);
  } else if (notificationType === NotificationType.UPDATE) {
    updateNotification(mergedProps);
  }
};

const failure = (notificationType: NotificationType, props: NotificationData) => {
  const defaults = {
    title: 'Oops!',
    icon: <IconX style={{ width: rem(20), height: rem(20) }} />,
    autoClose: 5000,
    color: 'red',
  };
  const mergedProps = { ...defaults, ...props };
  if (notificationType === NotificationType.SHOW) {
    return showNotification(mergedProps);
  } else if (notificationType === NotificationType.UPDATE) {
    updateNotification(mergedProps);
  }
};

export const loading = (title: string, message?: string) => {
  return showNotification({
    loading: true,
    title: title,
    message: message,
    autoClose: false,
    withCloseButton: false,
  });
};

export const updateSuccess = (id: string, message: string) => {
  success(NotificationType.UPDATE, { id, message: message });
};

export const showSuccess = (message: string) => {
  success(NotificationType.SHOW, { message: message });
};

export const updateFailure = (id: string, message: string) => {
  failure(NotificationType.UPDATE, { id, message: message });
};

export const showFailure = (message: string) => {
  failure(NotificationType.SHOW, { message: message });
};

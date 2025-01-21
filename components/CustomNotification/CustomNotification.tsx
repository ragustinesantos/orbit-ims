import { IconCheck, IconX } from '@tabler/icons-react';
import { Notification, rem } from '@mantine/core';
import classnames from './CustomNotification.module.css';

export default function CustomNotification(
  notificationType: string,
  notificationTitle: string,
  notificationMessage: string,
  setShowNotification: (bool: boolean) => void
) {
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

  return (
    <Notification
      withBorder
      icon={notificationType === 'success' ? checkIcon : xIcon}
      color={notificationType === 'success' ? 'green' : 'red'}
      title={notificationTitle}
      onClose={() => setShowNotification(false)}
      className={classnames.notification}
    >
      {notificationMessage}
    </Notification>
  );
}

import React from 'react';
import { useSelector } from 'react-redux';
import { Snackbar } from 'react-native-paper';

import { dismissNotification } from 'lib/ui';

function Notification({ notification }) {
  const [closing, setClosing] = React.useState(false);
  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      dismissNotification(notification.id);
    }, 100);
  };

  return (
    <Snackbar
      duration={5000}
      action={{
        label: 'Dismiss',
        onPress: dismiss,
      }}
      {...notification.options}
      onDismiss={dismiss}
      visible={!closing}
    >
      {notification.content}
    </Snackbar>
  );
}

export default function Notifications() {
  const notifications = useSelector((state) => state.ui.notifications);

  return notifications.map((notif) => (
    <Notification key={notif.id} notification={notif} />
  ));
}

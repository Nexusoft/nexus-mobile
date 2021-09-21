import React from 'react';
import { Button } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import ErrorIcon from 'icons/error.svg';

export default function ErrorDialog({ message, onDismiss, ...rest }) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog onDismiss={onDismiss} {...rest}>
        <Dialog.Title
          style={{
            color: theme.danger,
          }}
        >
          <SvgIcon
            icon={ErrorIcon}
            color={theme.danger}
            size={20}
            style={{ marginRight: 5 }}
          />{' '}
          Error
        </Dialog.Title>
        <Dialog.Content>
          <Text>{message || 'Unknown error'}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={onDismiss}>
            Dismiss
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

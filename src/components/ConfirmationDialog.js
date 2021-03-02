import React from 'react';
import { Button } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import Text from 'components/Text';

export default function ConfirmationDialog({
  title,
  message,
  cancelLabel,
  confirmLabel,
  onDismiss,
  onConfirm,
  onCancel,
  danger,
  ...rest
}) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog dismissable={false} {...rest}>
        {title && (
          <Dialog.Title>
            <Text>{title}</Text>
          </Dialog.Title>
        )}
        {!!message && (
          <Dialog.Content>
            <Text>{message}</Text>
          </Dialog.Content>
        )}
        <Dialog.Actions>
          <Button
            mode="text"
            onPress={() => {
              onCancel && onCancel();
              onDismiss && onDismiss();
            }}
            style={{ marginRight: 15 }}
          >
            {cancelLabel || 'Cancel'}
          </Button>
          <Button
            mode="text"
            color={danger ? theme.danger : undefined}
            onPress={() => {
              onConfirm && onConfirm();
              onDismiss && onDismiss();
            }}
          >
            {confirmLabel || 'Confirm'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

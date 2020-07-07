import React from 'react';
import { Button, Dialog } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Portal from 'components/Portal';
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
      <Dialog onDismiss={onDismiss} {...rest}>
        {title && <Dialog.Title>{title}</Dialog.Title>}
        <Dialog.Content>
          <Text>{message || ''}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            mode="text"
            onPress={() => {
              onCancel && onCancel();
              onDismiss();
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
              onDismiss();
            }}
          >
            {confirmLabel || 'Confirm'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

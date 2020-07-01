import React from 'react';
import styled from '@emotion/native';
import { Button, Dialog } from 'react-native-paper';

import Portal from 'components/Portal';

export default function ErrorDialog({ message, onDismiss, ...rest }) {
  return (
    <Portal>
      <Dialog onDismiss={onDismiss} {...rest}>
        <Dialog.Title>Error</Dialog.Title>
        <Dialog.Content>{message}</Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={onDismiss}>
            Dismiss
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

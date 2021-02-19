import React from 'react';
import { Button, Dialog } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Portal from 'components/Portal';
import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import InfoIcon from 'icons/info-circle.svg';

export default function InfoDialog({ message, onDismiss, ...rest }) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog
        style={{ height: 100, width: 100 }}
        onDismiss={onDismiss}
        {...rest}
      >
        <Dialog.Title
          style={{
            color: theme.primary,
          }}
        >
          <SvgIcon
            icon={InfoIcon}
            color={theme.primary}
            size={20}
            style={{ marginRight: 5 }}
          />{' '}
          Info
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ height: 1000, width: 1000 }}>asdasdas</Text>
          <Text>{message}</Text>
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

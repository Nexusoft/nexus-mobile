import React from 'react';
import { Button } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import InfoIcon from 'icons/info-circle.svg';

export default function InfoDialog({ message, onDismiss, ...rest }) {
  const theme = useTheme();
  return (
    <Portal>
      <Dialog onDismiss={onDismiss} {...rest}>
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

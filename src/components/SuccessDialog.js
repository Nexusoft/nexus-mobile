import React from 'react';
import { Button } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import SuccessIcon from 'icons/check-circle.svg';

export default function SuccessDialog({
  message,
  onDismiss,
  getButtons,
  ...rest
}) {
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
            icon={SuccessIcon}
            color={theme.primary}
            size={20}
            style={{ marginRight: 5 }}
          />{' '}
          Success
        </Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          {getButtons ? (
            getButtons({ onDismiss })
          ) : (
            <Button mode="text" onPress={onDismiss}>
              Dismiss
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

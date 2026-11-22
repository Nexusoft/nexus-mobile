import React from 'react';
import { Button } from 'react-native-paper';
import { useTheme } from 'lib/theme';
import { t } from 'lib/i18n';

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
          {t('Error')}
        </Dialog.Title>
        <Dialog.Content>
          <Text>{message || t('Unknown error')}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="text" onPress={onDismiss}>
            {t('Dismiss')}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

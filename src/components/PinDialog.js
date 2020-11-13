import React from 'react';
import { Platform } from 'react-native';
import { Button, Dialog } from 'react-native-paper';

import SvgIcon from 'components/SvgIcon';
import TextBox from 'components/TextBox';
import Portal from 'components/Portal';
import LockIcon from 'icons/lock.svg';

export default function PinDialog({ onDismiss, onCancel, onConfirm, ...rest }) {
  const [pin, setPin] = React.useState('');
  return (
    <Portal>
      <Dialog
        onDismiss={() => {
          onCancel && onCancel();
          onDismiss && onDismiss();
        }}
        {...rest}
      >
        <Dialog.Content>
          <TextBox
            style={{ fontSize: 18 }}
            background="surface"
            label="Confirm your PIN"
            value={pin}
            onChangeText={setPin}
            autoFocus
            secure
            keyboardType={
              Platform.OS === 'android' ? 'default' : 'numbers-and-punctuation'
            }
          />
          <Button
            style={{ marginTop: 30 }}
            mode="contained"
            icon={({ color, size }) => (
              <SvgIcon icon={LockIcon} color={color} size={size} />
            )}
            onPress={() => {
              onConfirm && onConfirm(pin);
              onDismiss && onDismiss();
            }}
          >
            Proceed
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

import React from 'react';
import { Platform } from 'react-native';
import { Button, Dialog } from 'react-native-paper';

import SvgIcon from 'components/SvgIcon';
import { TextBox } from 'components/Adaptive';
import Portal from 'components/Portal';
import LockIcon from 'icons/lock.svg';

export default function PinDialog({ onDismiss, ...rest }) {
  const [pin, setPin] = React.useState('');
  return (
    <Portal>
      <Dialog onDismiss={onDismiss} keyboardAware {...rest}>
        <Dialog.Content>
          <TextBox
            label="Confirm your PIN"
            value={pin}
            onChangeText={setPin}
            autoFocus
            secureTextEntry={true}
            keyboardType={
              Platform.OS === 'android'
                ? 'visible-password'
                : 'numbers-and-punctuation'
            }
          />
          <Button
            mode="contained"
            icon={({ color, size }) => (
              <SvgIcon icon={LockIcon} color={color} size={size} />
            )}
            style={{ marginTop: 30 }}
            onPress={onDismiss}
          >
            Proceed
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

import React from 'react';
import { Platform } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';

import SvgIcon from 'components/SvgIcon';
import { PaperTextInput } from 'components/Adaptive';
import LockIcon from 'icons/lock.svg';

export default function PinDialog({ dismissModal, ...rest }) {
  const [pin, setPin] = React.useState('');
  return (
    <Portal>
      <Dialog onDismiss={dismissModal} keyboardAware {...rest}>
        <Dialog.Content>
          <PaperTextInput
            label="Confirm your PIN"
            value={pin}
            onChangeText={setPin}
            autoCorrect={false}
            autoCapitalize="none"
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
            onPress={dismissModal}
          >
            Proceed
          </Button>
          <Button
            mode="contained"
            icon={({ color, size }) => (
              <SvgIcon icon={LockIcon} color={color} size={size} />
            )}
            style={{ marginTop: 30 }}
            onPress={dismissModal}
          >
            Proceed
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

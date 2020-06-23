import React from 'react';
import { Platform } from 'react-native';
import { Button } from 'react-native-paper';

import Modal from 'components/Modal';
import SvgIcon from 'components/SvgIcon';
import { PaperTextInput } from 'components/Adaptive';
import LockIcon from 'icons/lock.svg';

export default function PinModal({ dismissModal, ...rest }) {
  const [pin, setPin] = React.useState('');
  return (
    <Modal
      style={{ paddingVertical: 20, paddingHorizontal: 20 }}
      onDismiss={dismissModal}
      {...rest}
    >
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
    </Modal>
  );
}

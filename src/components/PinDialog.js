import React from 'react';
import styled from '@emotion/native';
import { Platform } from 'react-native';
import { Button, Dialog } from 'react-native-paper';

import SvgIcon from 'components/SvgIcon';
import { TextBox } from 'components/Adaptive';
import Portal from 'components/Portal';
import LockIcon from 'icons/lock.svg';

const PinTextBox = styled(TextBox)({
  fontSize: 18,
});

const SubmitBtn = styled(Button)({
  marginTop: 30,
});

export default function PinDialog({ onDismiss, ...rest }) {
  const [pin, setPin] = React.useState('');
  return (
    <Portal>
      <Dialog onDismiss={onDismiss} keyboardAware {...rest}>
        <Dialog.Content>
          <PinTextBox
            label="Confirm your PIN"
            value={pin}
            onChangeText={setPin}
            autoFocus
            secure
            keyboardType={
              Platform.OS === 'android'
                ? 'visible-password'
                : 'numbers-and-punctuation'
            }
          />
          <SubmitBtn
            mode="contained"
            icon={({ color, size }) => (
              <SvgIcon icon={LockIcon} color={color} size={size} />
            )}
            onPress={onDismiss}
          >
            Proceed
          </SubmitBtn>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

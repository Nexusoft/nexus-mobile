import React from 'react';
import { Platform, View } from 'react-native';
import { Button, Dialog } from 'react-native-paper';

import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import Portal from 'components/Portal';
import LockIcon from 'icons/lock.svg';

const styles = {
  pinInput: { fontSize: 18, marginBottom: 30 },
  feeText: {
    textAlign: 'center',
    marginBottom: 10,
  },
};

export default function PinDialog({
  fee,
  onDismiss,
  onCancel,
  onConfirm,
  ...rest
}) {
  const [pin, setPin] = React.useState('');
  const submit = () => {
    onConfirm?.(pin);
    onDismiss?.();
  };
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
            style={styles.pinInput}
            background="surface"
            label="Confirm your PIN"
            value={pin}
            onChangeText={setPin}
            autoFocus
            secure
            keyboardType={
              Platform.OS === 'android' ? 'default' : 'numbers-and-punctuation'
            }
            onSubmitEditing={submit}
          />
          {!!fee && <Text style={styles.feeText}>Fee: {fee} NXS</Text>}
          <Button
            mode="contained"
            icon={({ color, size }) => (
              <SvgIcon icon={LockIcon} color={color} size={size} />
            )}
            onPress={submit}
          >
            Proceed
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

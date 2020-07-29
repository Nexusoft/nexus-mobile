import React from 'react';
import { FAB } from 'react-native-paper';

import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import PinDialog from 'components/PinDialog';

export default function NewAccountScreen() {
  const [confirmingPin, setConfirmingPin] = React.useState(false);
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <TextBox label="Account name" />
      <FAB
        mode="contained"
        style={{ marginTop: 30 }}
        onPress={() => {
          setConfirmingPin(true);
        }}
        label="Create account"
      />

      <PinDialog
        visible={confirmingPin}
        onDismiss={() => {
          setConfirmingPin(false);
        }}
      />
    </ScreenBody>
  );
}

NewAccountScreen.nav = {
  name: 'NewAccount',
  options: {
    title: 'New Account',
  },
};

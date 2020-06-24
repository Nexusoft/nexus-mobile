import React from 'react';
import { Button } from 'react-native-paper';

import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import PinDialog from 'components/PinDialog';

export default function () {
  const [confirmingPin, setConfirmingPin] = React.useState(false);
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <TextBox.Adaptive label="Account name" />
      <Button
        mode="contained"
        style={{ marginTop: 30 }}
        onPress={() => {
          setConfirmingPin(true);
        }}
      >
        Create account
      </Button>

      <PinDialog
        visible={confirmingPin}
        onDismiss={() => {
          setConfirmingPin(false);
        }}
      />
    </ScreenBody>
  );
}

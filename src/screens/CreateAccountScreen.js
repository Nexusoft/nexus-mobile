import React from 'react';
import { Button } from 'react-native-paper';

import { PaperTextInput } from 'components/Adaptive';
import ScreenBody from 'components/ScreenBody';
import PinModal from 'components/PinModal';

export default function () {
  const [confirmingPin, setConfirmingPin] = React.useState(false);
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <PaperTextInput
        label="Account name"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button
        mode="contained"
        style={{ marginTop: 30 }}
        onPress={() => {
          setConfirmingPin(true);
        }}
      >
        Create account
      </Button>

      <PinModal
        visible={confirmingPin}
        dismissModal={() => {
          setConfirmingPin(false);
        }}
      />
    </ScreenBody>
  );
}

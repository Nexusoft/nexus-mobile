import React from 'react';
import { Button } from 'react-native-paper';

import { PaperTextInput } from 'components/Adaptive';
import ScreenBody from 'components/ScreenBody';

export default function () {
  return (
    <ScreenBody
      scroll={false}
      style={{ paddingVertical: 50, paddingHorizontal: 30 }}
    >
      <PaperTextInput
        label="Account name"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button mode="contained" style={{ marginTop: 30 }} onPress={() => {}}>
        Create account
      </Button>
    </ScreenBody>
  );
}

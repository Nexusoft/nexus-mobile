import React from 'react';
import { Button } from 'react-native-paper';

import TextBox from 'components/TextBox';
import ScreenBody from 'components/ScreenBody';
import { createContact } from 'lib/contacts';

export default function NewContactScreen() {
  return (
    <ScreenBody style={{ paddingVertical: 50, paddingHorizontal: 30 }}>
      <TextBox.Adaptive label="Contact name" />
      <TextBox.Adaptive label="Contact's Nexus address" />
      <Button
        mode="contained"
        style={{ marginTop: 30 }}
        onPress={() => {
          createContact({});
        }}
      >
        Create account
      </Button>
    </ScreenBody>
  );
}

NewContactScreen.nav = {
  name: 'NewContact',
  options: {
    title: 'New Contact',
  },
};

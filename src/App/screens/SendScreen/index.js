import React from 'react';

import ScreenBody from 'components/ScreenBody';

import SendFrom from './SendFrom';
import SendTo from './SendTo';

export default function SendScreen({ route }) {
  const account = route.params?.account;

  return (
    <ScreenBody scroll={false}>
      <SendFrom account={account} />
      <SendTo account={account} />
    </ScreenBody>
  );
}

SendScreen.nav = {
  name: 'Send',
  options: {
    headerShown: false,
  },
};

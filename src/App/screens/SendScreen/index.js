import React from 'react';

import ScreenBody from 'components/ScreenBody';
import ZeroConnectionsOverlay from 'components/ZeroConnectionsOverlay';
import SendFrom from './SendFrom';
import SendTo from './SendTo';

export default function SendScreen({ route }) {
  const account = route.params?.account;

  return (
    <ScreenBody>
      <SendFrom account={account} />
      <SendTo account={account} />
      <ZeroConnectionsOverlay />
    </ScreenBody>
  );
}

SendScreen.nav = {
  name: 'Send',
};

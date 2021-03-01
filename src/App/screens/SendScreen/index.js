import React from 'react';
import { HeaderTitle } from '@react-navigation/stack';

import ScreenBody from 'components/ScreenBody';
import ZeroConnectionsOverlay from 'components/ZeroConnectionsOverlay';
import TokenName from 'components/TokenName';
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
  options: ({ route }) => ({
    headerTitle: ({ style, tintColor }) => (
      <HeaderTitle style={style} tintColor={tintColor}>
        Send <TokenName bold account={route.params?.account} verbose />
      </HeaderTitle>
    ),
  }),
};

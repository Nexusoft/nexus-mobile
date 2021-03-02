import React from 'react';
import { Button } from 'react-native-paper';
import { View } from 'react-native';
import { useTheme } from 'lib/theme';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import Text from 'components/Text';
import { updateSettings } from 'lib/settings';

const screens = [
  {
    title: 'Welcome',
    body:
      'Congratulations on installing the Nexus Wallet, your gateway to the Nexus Blockchain',
  },
  {
    title: 'Nexus Core Lite Node',
    body:
      'Unlike other cryptocurrency wallets that interface with a server, Nexus runs on your phone allowing you full decentralized control.' +
      (Platform.OS === 'android'
        ? '\n\nThe core will continue to sync in the background when you are not using the app, indicated by the Nexus icon in your notification bar.'
        : '\n\nApple guidelines restrict how apps run in the background, while the app is in the background you may find that you are not in sync with the blockchain.') +
      "\n\n To close Nexus and stop the core from running, open up your phone's App Switcher and close the app",
  },
  {
    title: 'How a Lite Node Works',
    body:
      'A Node running in Lite mode only communicates with other Full Nodes and only downloads the Headers of each block. This means that your node is limited in certain ways.' +
      '\n\n•Lite Mode only downloads logged in sigchains, you must communicate with a full node in order to retrieve certain information.' +
      '\n\n•Lite Mode does not support Staking, you can not relay blocks to other nodes.' +
      '\n\nUsers interested in those features should install our Desktop Wallet and enable Full Node.',
  },
  {
    title: 'Beta',
    body:
      'Thank you for participating in the Nexus Wallet Mobile Open Beta.' +
      '\n\nWe encourage users to visit our website Nexus.io to learn more or provide feedback.',
  },
];

function ProgressScreen(screenOn, progress, onDismiss) {
  if (screenOn < screens.length - 1) {
    progress(screenOn + 1);
  } else {
    onDismiss();
  }
}

export default function InfoDialog({ onDismiss, ...rest }) {
  const theme = useTheme();
  const [screenOn, progress] = React.useState(0);
  const { title, body } = screens[screenOn];
  const close = () => {
    updateSettings({ showOnboarding: false });
    onDismiss();
  };

  return (
    <Portal>
      <Dialog
        style={{
          height: '95%',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
        onDismiss={close}
        {...rest}
      >
        <Dialog.Title
          style={{
            color: theme.primary,
            textAlign: 'center',
          }}
        >
          {title}
        </Dialog.Title>
        <Dialog.Content style={{}}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'space-around',
            }}
          >
            <Text style={{ textAlign: 'center', flex: 0 }}>{body}</Text>
            <View style={{ minHeight: '20%' }}></View>
            <Button
              mode="contained"
              onPress={() => ProgressScreen(screenOn, progress, close)}
            >
              Continue
            </Button>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={{}} mode="text" onPress={close}>
            Skip
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

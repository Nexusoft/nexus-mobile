import React from 'react';
import { Button } from 'react-native-paper';
import { View } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import Text from 'components/Text';
import { useTheme } from 'lib/theme';
import { updateSettings } from 'lib/settings';

const screens = [
  {
    key: 'welcome',
    title: 'Welcome!',
    body:
      'Congratulations on installing the Nexus Wallet, your gateway to the Nexus Blockchain',
  },
  {
    key: 'lite-node',
    title: 'Nexus Core Lite Node',
    body:
      'Unlike other cryptocurrency wallets that interface with a server, Nexus runs on your phone allowing you full decentralized control.' +
      (Platform.OS === 'android'
        ? '\n\nThe core will continue to sync in the background when you are not using the app, indicated by the Nexus icon in your notification bar.'
        : '\n\nApple guidelines restrict how apps run in the background, while the app is in the background you may find that you are not in sync with the blockchain.') +
      "\n\n To close Nexus and stop the core from running, open up your phone's App Switcher and close the app",
  },
  {
    key: 'lite-node-works',
    title: 'How a Lite Node Works',
    body:
      'A Node running in Lite mode only communicates with other Full Nodes and only downloads the Headers of each block. This means that your node is limited in certain ways.' +
      '\n\n• Lite Mode only downloads logged in sigchains, you must communicate with a full node in order to retrieve certain information.' +
      '\n\n• Lite Mode does not support Staking, you cannot relay blocks to other nodes.' +
      '\n\nUsers interested in those features should install our Desktop Wallet and enable Full Node.',
  },
  {
    key: 'security',
    title: 'Account and Security',
    body:
      "With Nexus there is no need to have local keys or 'wallet.dat's , Username/Password/Pin are all stored on the chain and can be accessed from anywhere and from any platform." +
      '\n\nYou can use the Recovery feature to retrieve credentials if the user forgets his password or pin. Set a passphrase with the Set Recovery option after logging in.' +
      '\n\n\nNexus has post-quantum resistant technology that prevents a host of attack vectors, both on Desktop and Mobile.',
  },
  {
    key: 'beta',
    title: 'Beta',
    body:
      'Thank you for participating in the Nexus Wallet Mobile Open Beta.' +
      '\n\nWe encourage users to visit our website nexus.io to learn more or provide feedback.',
  },
];

// function ProgressScreen(screenOn, progress, onDismiss) {
//   if (screenOn < screens.length - 1) {
//     progress(screenOn + 1);
//   } else {
//     onDismiss();
//   }
// }

function SliderButton({ children, style, ...rest }) {
  return (
    <Text
      bold
      size={18}
      style={[
        {
          padding: 12,
          // textTransform: 'uppercase',
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

export default function InfoDialog({ onDismiss, ...rest }) {
  const theme = useTheme();
  // const [screenOn, progress] = React.useState(0);
  // const { title, body } = screens[screenOn];
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
        dismissable={false}
        {...rest}
      >
        {/* <Dialog.Title
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
        </Dialog.Actions> */}
        <AppIntroSlider
          showSkipButton
          data={screens}
          renderItem={({ item }) => (
            <>
              <Dialog.Title
                style={{
                  color: theme.primary,
                  textAlign: 'center',
                }}
              >
                {item.title}
              </Dialog.Title>
              <Dialog.Content style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      flex: 0,
                    }}
                  >
                    {item.body}
                  </Text>
                  <View style={{ minHeight: '20%' }}></View>
                </View>
              </Dialog.Content>
            </>
          )}
          renderNextButton={() => (
            <SliderButton colorName="primary">Next</SliderButton>
          )}
          renderDoneButton={() => (
            <SliderButton colorName="primary">Done</SliderButton>
          )}
          renderSkipButton={() => <SliderButton sub>Skip</SliderButton>}
          activeDotStyle={{ backgroundColor: theme.primary }}
          onSkip={close}
          onDone={close}
        />
      </Dialog>
    </Portal>
  );
}

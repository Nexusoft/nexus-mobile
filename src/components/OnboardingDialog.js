import React from 'react';
import { Button } from 'react-native-paper';
import { View, Platform } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import Portal from 'components/Portal';
import Dialog from 'components/Dialog';
import Text from 'components/Text';
import { useTheme } from 'lib/theme';
import { updateSettings } from 'lib/settings';
import { t } from 'lib/i18n';

//built at render time so the texts follow the chosen language
const getScreens = () => [
  {
    key: 'welcome',
    title: t('Welcome!'),
    body: t(
      'Congratulations on installing the Nexus Wallet, your gateway to the Nexus Blockchain'
    ),
  },
  {
    key: 'lite-node',
    title: t('Nexus Core Lite Node'),
    body:
      t(
        'Unlike other cryptocurrency wallets that interface with a server, Nexus runs on your phone allowing you full decentralized control.'
      ) +
      '\n\n' +
      (Platform.OS === 'android'
        ? t(
            'The core will continue to sync in the background when you are not using the app, indicated by the Nexus icon in your notification bar.'
          )
        : t(
            'Apple guidelines restrict how apps run in the background, while the app is in the background you may find that you are not in sync with the blockchain.'
          )) +
      '\n\n ' +
      t(
        "To close Nexus and stop the core from running, open up your phone's App Switcher and close the app"
      ),
  },
  {
    key: 'lite-node-works',
    title: t('How a Lite Node Works'),
    body:
      t(
        'A Node running in Lite mode only communicates with other Full Nodes and only downloads the Headers of each block. This means that your node is limited in certain ways.'
      ) +
      '\n\n• ' +
      t(
        'Lite Mode only downloads logged in sigchains, you must communicate with a full node in order to retrieve certain information.'
      ) +
      '\n\n• ' +
      t(
        'Lite Mode does not support Staking, you cannot relay blocks to other nodes.'
      ) +
      '\n\n' +
      t(
        'Users interested in those features should install our Desktop Wallet and enable Full Node.'
      ),
  },
  {
    key: 'security',
    title: t('Account and Security'),
    body:
      t(
        "With Nexus there is no need to have local keys or 'wallet.dat's , Username/Password/Pin are all stored on the chain and can be accessed from anywhere and from any platform."
      ) +
      '\n\n' +
      t(
        'You can use the Recovery feature to retrieve credentials if the user forgets his password or pin. Set a passphrase with the Set Recovery option after logging in.'
      ) +
      '\n\n\n' +
      t(
        'Nexus has post-quantum resistant technology that prevents a host of attack vectors, both on Desktop and Mobile.'
      ),
  },
  {
    key: 'beta',
    title: t('Beta'),
    body:
      t('Thank you for participating in the Nexus Wallet Mobile Open Beta.') +
      '\n\n' +
      t(
        'We encourage users to visit our website nexus.io to learn more or provide feedback.'
      ),
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
  const screens = getScreens();
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
            <SliderButton colorName="primary">{t('Next')}</SliderButton>
          )}
          renderDoneButton={() => (
            <SliderButton colorName="primary">{t('Done')}</SliderButton>
          )}
          renderSkipButton={() => <SliderButton sub>{t('Skip')}</SliderButton>}
          activeDotStyle={{ backgroundColor: theme.primary }}
          onSkip={close}
          onDone={close}
        />
      </Dialog>
    </Portal>
  );
}

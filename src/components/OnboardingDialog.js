import React from 'react';
import { View, Image, Platform, ScrollView, BackHandler } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import Portal from 'components/Portal';
import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import { useTheme } from 'lib/theme';
import { updateSettings } from 'lib/settings';
import { t } from 'lib/i18n';
import LogoFull from 'icons/logo-full.svg';
import NexusIcon from 'icons/nexus.svg';
import CoreIcon from 'icons/core.svg';
import LockIcon from 'icons/lock.svg';
import SendIcon from 'icons/send.svg';
import StakeIcon from 'icons/stake.svg';
import InvoiceIcon from 'icons/invoice.svg';
import KeyIcon from 'icons/key.svg';
import RecoveryIcon from 'icons/recovery.svg';
import GlobeIcon from 'icons/globe.svg';

const shots = {
  overview: require('../../assets/images/onboarding-overview.jpg'),
  activity: require('../../assets/images/onboarding-activity.jpg'),
};

//built at render time so the texts follow the chosen language
const getScreens = () => [
  {
    key: 'welcome',
    art: { logo: true },
    title: t('Welcome to Nexus'),
    body: t(
      'Congratulations on installing the Nexus Wallet, your gateway to the Nexus Blockchain'
    ),
    points: [
      { icon: SendIcon, text: t('Send and receive NXS and tokens') },
      { icon: StakeIcon, text: t('Follow and manage your stake') },
      { icon: InvoiceIcon, text: t('Invoices, names and a monthly summary') },
    ],
  },
  {
    key: 'overview',
    art: { shot: shots.overview },
    title: t('Everything at a glance'),
    body: t(
      'Your balance, your accounts and quick actions on one screen. Tap an account for its QR code and details.'
    ),
  },
  {
    key: 'activity',
    art: { shot: shots.activity },
    title: t('Know where your NXS go'),
    body: t(
      'Every transaction with all its parts, a monthly summary of what came in and went out, and your history as a CSV file.'
    ),
  },
  {
    key: 'lite-node',
    art: { icon: CoreIcon },
    title: t('A real Nexus node on your phone'),
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
          )),
    points: [
      {
        icon: GlobeIcon,
        text: t(
          'Lite Mode only downloads logged in sigchains, you must communicate with a full node in order to retrieve certain information.'
        ),
      },
      {
        icon: StakeIcon,
        text: t(
          'Lite Mode does not support Staking, you cannot relay blocks to other nodes.'
        ),
      },
    ],
  },
  {
    key: 'security',
    art: { icon: LockIcon },
    title: t('Account and Security'),
    body: t(
      "With Nexus there is no need to have local keys or 'wallet.dat's , Username/Password/Pin are all stored on the chain and can be accessed from anywhere and from any platform."
    ),
    points: [
      {
        icon: RecoveryIcon,
        text: t(
          'You can use the Recovery feature to retrieve credentials if the user forgets his password or pin. Set a passphrase with the Set Recovery option after logging in.'
        ),
      },
      {
        icon: KeyIcon,
        text: t(
          'Lock the app with your PIN or fingerprint in Settings, Security.'
        ),
      },
      {
        icon: NexusIcon,
        text: t(
          'Nexus has post-quantum resistant technology that prevents a host of attack vectors, both on Desktop and Mobile.'
        ),
      },
    ],
  },
  {
    key: 'beta',
    art: { icon: NexusIcon },
    title: t('You are all set'),
    body:
      t('Thank you for participating in the Nexus Wallet Mobile Open Beta.') +
      '\n\n' +
      t(
        'We encourage users to visit our website nexus.io to learn more or provide feedback.'
      ),
  },
];

const styles = {
  root: ({ theme }) => ({
    ...StyleFill,
    backgroundColor: theme.background,
  }),
  art: ({ theme }) => ({
    height: '42%',
    minHeight: 220,
    backgroundColor: theme.dark ? '#0b2a3c' : theme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
  }),
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phone: {
    marginTop: 34,
    width: 190,
    flex: 1,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 6,
    borderBottomWidth: 0,
    borderColor: '#0d1b26',
    backgroundColor: '#0d1b26',
    overflow: 'hidden',
  },
  shot: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  text: {
    paddingHorizontal: 26,
    paddingTop: 22,
    paddingBottom: 110,
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  body: {
    textAlign: 'center',
    lineHeight: 21,
  },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 14,
  },
  pointIcon: ({ theme }) => ({
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.dark ? '#173445' : '#fff',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  }),
};

const StyleFill = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

function Art({ art }) {
  const theme = useTheme();
  if (art.logo) {
    return (
      <View style={styles.art({ theme })}>
        <SvgIcon icon={LogoFull} width={220} height={80} color="#fff" />
      </View>
    );
  }
  if (art.shot) {
    return (
      <View style={[styles.art({ theme }), { justifyContent: 'flex-start' }]}>
        <View style={styles.phone}>
          <Image source={art.shot} style={styles.shot} resizeMode="cover" />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.art({ theme })}>
      <View style={styles.circle}>
        <SvgIcon icon={art.icon} size={56} color="#fff" />
      </View>
    </View>
  );
}

function Slide({ item }) {
  const theme = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Art art={item.art} />
      <ScrollView contentContainerStyle={styles.text}>
        <Text bold size={22} colorName="primary" style={styles.title}>
          {item.title}
        </Text>
        <Text size={15} style={styles.body}>
          {item.body}
        </Text>
        {item.points?.map((point, i) => (
          <View key={i} style={styles.point}>
            <View style={styles.pointIcon({ theme })}>
              <SvgIcon icon={point.icon} size={15} colorName="primary" />
            </View>
            <Text size={14} style={{ flex: 1, lineHeight: 20 }}>
              {point.text}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function SliderButton({ children, style, ...rest }) {
  return (
    <Text bold size={17} style={[{ padding: 12 }, style]} {...rest}>
      {children}
    </Text>
  );
}

export default function OnboardingDialog({ onDismiss, visible }) {
  const theme = useTheme();
  const screens = getScreens();
  const close = () => {
    updateSettings({ showOnboarding: false });
    onDismiss();
  };

  React.useEffect(() => {
    if (Platform.OS !== 'android' || !visible) return;
    const handleBack = () => true;
    BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
  }, [visible]);

  if (!visible) return null;
  return (
    <Portal>
      <View style={styles.root({ theme })}>
        <AppIntroSlider
          showSkipButton
          data={screens}
          renderItem={({ item }) => <Slide item={item} />}
          renderNextButton={() => (
            <SliderButton colorName="primary">{t('Next')}</SliderButton>
          )}
          renderDoneButton={() => (
            <SliderButton colorName="primary">{t("Let's go")}</SliderButton>
          )}
          renderSkipButton={() => <SliderButton sub>{t('Skip')}</SliderButton>}
          activeDotStyle={{ backgroundColor: theme.primary, width: 18 }}
          dotStyle={{
            backgroundColor: theme.dark
              ? 'rgba(255,255,255,0.25)'
              : 'rgba(0,0,0,0.18)',
          }}
          onSkip={close}
          onDone={close}
        />
      </View>
    </Portal>
  );
}

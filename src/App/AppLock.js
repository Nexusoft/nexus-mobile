import React from 'react';
import {
  AppState,
  BackHandler,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { Button, FAB } from 'react-native-paper';

import Text from 'components/Text';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import PinPad from 'components/PinPad';
import { useTheme } from 'lib/theme';
import { selectAppLocked, unlockApp, checkPin } from 'lib/appLock';
import { biometricAvailable, checkBiometric } from 'lib/biometric';
import { selectSetting } from 'lib/settings';
import { selectUsername } from 'lib/user';
import { logOut } from 'lib/session';
import { showError } from 'lib/ui';
import LockIcon from 'icons/lock.svg';
import UnlockIcon from 'icons/unlock.svg';

const styles = {
  cover: ({ theme }) => ({
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: theme.dark ? theme.background : theme.primary,
  }),
  title: { marginTop: 12, textAlign: 'center' },
  pinInput: { marginVertical: 20, width: '100%', maxWidth: 250 },
  submitBtn: { width: '100%', maxWidth: 250, marginTop: 10 },
};

function LockScreen() {
  const theme = useTheme();
  const username = useSelector(selectUsername);
  const [pin, setPin] = React.useState('');
  const [checking, setChecking] = React.useState(false);
  const [useKeyboard, setUseKeyboard] = React.useState(false);
  const [canBiometric, setCanBiometric] = React.useState(false);
  const color = theme.dark ? theme.foreground : theme.onPrimary;

  const tryBiometric = async () => {
    if (await checkBiometric('Open Nexus Wallet')) unlockApp();
  };

  React.useEffect(() => {
    (async () => {
      const available = await biometricAvailable();
      setCanBiometric(available);
      if (available && AppState.currentState === 'active') tryBiometric();
    })();
    //back stays on the lock screen
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, []);

  const submit = async (value = pin) => {
    if (!value || checking) return;
    setChecking(true);
    try {
      const ok = await checkPin(value);
      if (ok === false) {
        setPin('');
        showError('Wrong PIN');
      } else if (ok === null) {
        showError(
          'This Nexus Core cannot check a PIN. Log out and log in again to open the wallet.'
        );
      } else {
        unlockApp();
      }
    } catch (err) {
      showError(err?.message);
    } finally {
      setChecking(false);
    }
  };

  return (
    <View style={styles.cover({ theme })} accessibilityLabel="Wallet locked">
      <SvgIcon icon={LockIcon} size={48} color={color} />
      <Text style={styles.title} size={22} color={color}>
        Wallet locked
      </Text>
      {!!username && (
        <Text sub size={14} color={color} style={{ marginTop: 4 }}>
          {username}
        </Text>
      )}
      {useKeyboard ? (
        <TextBox
          mode="flat"
          style={styles.pinInput}
          background={theme.dark ? 'background' : 'primary'}
          label="Enter your PIN"
          value={pin}
          onChangeText={setPin}
          onSubmitEditing={() => submit()}
          secure
          autoFocus
          keyboardType={
            Platform.OS === 'android' ? 'default' : 'numbers-and-punctuation'
          }
        />
      ) : (
        <PinPad
          value={pin}
          onChange={setPin}
          color={color}
          disabled={checking}
          onKeyboard={() => setUseKeyboard(true)}
        />
      )}
      <FAB
        disabled={checking || !pin}
        onPress={() => submit()}
        loading={checking}
        color={theme.dark ? theme.onPrimary : theme.primary}
        style={[
          styles.submitBtn,
          theme.dark ? undefined : { backgroundColor: theme.onPrimary },
        ]}
        icon={(props) => <SvgIcon icon={UnlockIcon} {...props} />}
        label={checking ? 'Checking...' : 'Open wallet'}
      />
      {canBiometric && (
        <Button
          mode="text"
          color={color}
          labelStyle={{ fontSize: 12 }}
          onPress={tryBiometric}
        >
          Use fingerprint / face
        </Button>
      )}
      <Button
        mode="text"
        color={color}
        labelStyle={{ fontSize: 12 }}
        onPress={() => logOut().catch((err) => showError(err?.message))}
      >
        Log out
      </Button>
    </View>
  );
}

//plain cover while the app is not in front (iOS app switcher picture)
function PrivacyCover() {
  const theme = useTheme();
  const color = theme.dark ? theme.foreground : theme.onPrimary;
  return (
    <View style={styles.cover({ theme })}>
      <SvgIcon icon={LockIcon} size={48} color={color} />
    </View>
  );
}

export default function AppLock() {
  const locked = useSelector(selectAppLocked);
  const hidePreview = useSelector(selectSetting('hidePreview'));
  const [appState, setAppState] = React.useState(AppState.currentState);
  React.useEffect(() => {
    const sub = AppState.addEventListener('change', setAppState);
    return () => sub?.remove();
  }, []);

  if (locked) return <LockScreen />;
  if (hidePreview && Platform.OS === 'ios' && appState !== 'active') {
    return <PrivacyCover />;
  }
  return null;
}

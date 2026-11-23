import React from 'react';
import { Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import Select from 'components/Select';
import Text from 'components/Text';
import Switch from 'components/Switch';
import { updateSettings, selectSetting } from 'lib/settings';
import { selectLoggedIn, selectUsername } from 'lib/user';
import { checkPin } from 'lib/appLock';
import { confirmPin, showError, showNotification } from 'lib/ui';
import {
  biometricAvailable,
  hasBiometricPin,
  enableBiometricPin,
  disableBiometricPin,
} from 'lib/biometric';
import formatNumber from 'utils/formatNumber';
import SettingItem from './SettingItem';
import styles from './styles';

const lockAfterOptions = [
  { value: 0, display: 'Right away' },
  { value: 30, display: '30 seconds' },
  { value: 60, display: '1 minute' },
  { value: 300, display: '5 minutes' },
  { value: 900, display: '15 minutes' },
];

const sendMaxOptions = [
  { value: 100, display: 'Above 100' },
  { value: 1000, display: 'Above 1,000' },
  { value: 10000, display: 'Above 10,000' },
  { value: 0, display: 'Never, fingerprint for every amount' },
];

//asks the PIN and checks it with the core before it goes into secure storage
async function askCheckedPin() {
  const pin = await confirmPin({});
  if (!pin) return null;
  const ok = await checkPin(pin);
  if (ok === false) {
    showError('Wrong PIN');
    return null;
  }
  return pin;
}

//one switch backed by a PIN in the phone's secure storage
function BiometricPinSetting({ username, purpose, title, description, disabled, onChange }) {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    hasBiometricPin(username, purpose).then((on) => {
      setEnabled(on);
      onChange?.(on);
    });
  }, [username]);
  const set = (on) => {
    setEnabled(on);
    onChange?.(on);
  };
  return (
    <SettingItem
      title={title}
      description={description}
      right={
        <Switch
          value={enabled}
          disabled={disabled}
          onValueChange={async (value) => {
            if (!value) {
              await disableBiometricPin(username, purpose);
              set(false);
              return;
            }
            try {
              const pin = await askCheckedPin();
              if (!pin) return;
              const ok = await enableBiometricPin(username, pin, purpose);
              set(ok);
              if (ok) showNotification(`${title}: on`);
            } catch (err) {
              showError(err?.message);
            }
          }}
        />
      }
    />
  );
}

export default function SecuritySettings() {
  const loggedIn = useSelector(selectLoggedIn);
  const username = useSelector(selectUsername);
  const savedUsername = useSelector(selectSetting('savedUsername'));
  const sessionSaved = useSelector((state) => !!state.user.status?.saved);
  const appLock = useSelector(selectSetting('appLock'));
  const appLockAfter = useSelector(selectSetting('appLockAfter'));
  const hidePreview = useSelector(selectSetting('hidePreview'));
  const sendMax = useSelector(selectSetting('sendBiometricMax'));
  const [hasBiometric, setHasBiometric] = React.useState(false);
  const [sendOn, setSendOn] = React.useState(false);
  React.useEffect(() => {
    biometricAvailable().then(setHasBiometric);
  }, []);

  if (!loggedIn) return null;
  return (
    <>
      <Text style={styles.title} sub>
        Security
      </Text>
      <Surface style={styles.section}>
        <SettingItem
          title="Lock when I leave the app"
          description={
            hasBiometric
              ? 'Fingerprint, face or PIN to open the wallet again'
              : 'PIN to open the wallet again'
          }
          right={
            <Switch
              value={appLock}
              onValueChange={(value) => updateSettings({ appLock: !!value })}
            />
          }
        />
        {appLock && (
          <>
            <Divider inset={20} />
            <Select
              options={lockAfterOptions}
              value={appLockAfter}
              updateValue={(appLockAfter) =>
                updateSettings({ appLockAfter: Number(appLockAfter) })
              }
              render={({ display, openSelect }) => (
                <SettingItem
                  title="Lock after"
                  description={display}
                  primary
                  onPress={openSelect}
                />
              )}
            />
          </>
        )}

        <Divider inset={20} />
        <SettingItem
          title="Hide the app preview"
          description={
            Platform.OS === 'android'
              ? 'No balances in the recent apps list. Screenshots of the wallet are blocked too.'
              : 'Covers the wallet in the app switcher'
          }
          right={
            <Switch
              value={hidePreview}
              onValueChange={(value) => updateSettings({ hidePreview: !!value })}
            />
          }
        />

        {hasBiometric && (
          <>
            <Divider inset={20} />
            <BiometricPinSetting
              username={savedUsername}
              purpose="unlock"
              title="Fingerprint / face unlock"
              description={
                sessionSaved && savedUsername
                  ? 'Open a saved login with your fingerprint or face instead of typing the PIN'
                  : 'Log in with "Remember username" and "Keep me logged in" on to use this.'
              }
              disabled={!sessionSaved || !savedUsername}
            />

            <Divider inset={20} />
            <BiometricPinSetting
              username={username}
              purpose="send"
              title="Confirm sends with fingerprint"
              description="The PIN still works as a fallback"
              onChange={setSendOn}
            />
            {sendOn && (
              <>
                <Divider inset={20} />
                <Select
                  options={sendMaxOptions}
                  value={sendMax}
                  updateValue={(value) =>
                    updateSettings({ sendBiometricMax: Number(value) })
                  }
                  render={({ openSelect }) => (
                    <SettingItem
                      title="Always ask for the PIN"
                      description={
                        sendMax
                          ? `For amounts above ${formatNumber(sendMax)}`
                          : 'Never, fingerprint for every amount'
                      }
                      primary
                      onPress={openSelect}
                    />
                  )}
                />
              </>
            )}
          </>
        )}
      </Surface>
    </>
  );
}

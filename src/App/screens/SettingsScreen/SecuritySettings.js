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
import { t } from 'lib/i18n';
import SettingItem from './SettingItem';
import styles from './styles';

//functions so the texts are translated at render time
const getLockAfterOptions = () => [
  { value: 0, display: t('Right away') },
  { value: 30, display: t('30 seconds') },
  { value: 60, display: t('1 minute') },
  { value: 300, display: t('5 minutes') },
  { value: 900, display: t('15 minutes') },
];

const getSendMaxOptions = () => [
  { value: 100, display: t('Above {amount}', { amount: '100' }) },
  { value: 1000, display: t('Above {amount}', { amount: '1,000' }) },
  { value: 10000, display: t('Above {amount}', { amount: '10,000' }) },
  { value: 0, display: t('Never, fingerprint for every amount') },
];

//asks the PIN and checks it with the core before it goes into secure storage
async function askCheckedPin() {
  const pin = await confirmPin({});
  if (!pin) return null;
  const ok = await checkPin(pin);
  if (ok === false) {
    showError(t('Wrong PIN'));
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
              if (ok) showNotification(t('{setting}: on', { setting: title }));
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
        {t('Security')}
      </Text>
      <Surface style={styles.section}>
        <SettingItem
          title={t('Lock when I leave the app')}
          description={
            hasBiometric
              ? t('Fingerprint, face or PIN to open the wallet again')
              : t('PIN to open the wallet again')
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
              options={getLockAfterOptions()}
              value={appLockAfter}
              updateValue={(appLockAfter) =>
                updateSettings({ appLockAfter: Number(appLockAfter) })
              }
              render={({ display, openSelect }) => (
                <SettingItem
                  title={t('Lock after')}
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
          title={t('Hide the app preview')}
          description={
            Platform.OS === 'android'
              ? t('No balances in the recent apps list. Screenshots of the wallet are blocked too.')
              : t('Covers the wallet in the app switcher')
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
              title={t('Fingerprint / face unlock')}
              description={
                sessionSaved && savedUsername
                  ? t('Open a saved login with your fingerprint or face instead of typing the PIN')
                  : t('Log in with "Remember username" and "Keep me logged in" on to use this.')
              }
              disabled={!sessionSaved || !savedUsername}
            />

            <Divider inset={20} />
            <BiometricPinSetting
              username={username}
              purpose="send"
              title={t('Confirm sends with fingerprint')}
              description={t('The PIN still works as a fallback')}
              onChange={setSendOn}
            />
            {sendOn && (
              <>
                <Divider inset={20} />
                <Select
                  options={getSendMaxOptions()}
                  value={sendMax}
                  updateValue={(value) =>
                    updateSettings({ sendBiometricMax: Number(value) })
                  }
                  render={({ openSelect }) => (
                    <SettingItem
                      title={t('Always ask for the PIN')}
                      description={
                        sendMax
                          ? t('For amounts above {amount}', {
                              amount: formatNumber(sendMax),
                            })
                          : t('Never, fingerprint for every amount')
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

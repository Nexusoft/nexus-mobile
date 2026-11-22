import React from 'react';
import { useSelector } from 'react-redux';
import { Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import Select from 'components/Select';
import Text from 'components/Text';
import Switch from 'components/Switch';
import { updateSettings, selectSetting } from 'lib/settings';
import { selectLoggedIn } from 'lib/user';
import baseCurrencies from 'consts/baseCurrencies';
import SettingItem from './SettingItem';
import commonStyles from './styles';
import formatNumber from 'utils/formatNumber';
import { confirmPin, showError, showNotification } from 'lib/ui';
import {
  biometricAvailable,
  hasBiometricUnlock,
  enableBiometricUnlock,
  disableBiometricUnlock,
} from 'lib/biometric';

const styles = {
  ...commonStyles,
  switch: {
    marginLeft: 10,
  },
};

const themeOptions = [
  {
    value: 'auto',
    display: 'Auto',
  },
  {
    value: 'dark',
    display: 'Dark',
  },
  {
    value: 'light',
    display: 'Light',
  },
];

function BiometricSetting() {
  const savedUsername = useSelector(selectSetting('savedUsername'));
  const sessionSaved = useSelector((state) => !!state.user.status?.saved);
  const [available, setAvailable] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      setAvailable(await biometricAvailable());
      setEnabled(await hasBiometricUnlock(savedUsername));
    })();
  }, [savedUsername]);
  if (!available) return null;
  return (
    <>
      <Divider inset={20} />
      <SettingItem
        title="Fingerprint / face unlock"
        description={
          sessionSaved && savedUsername
            ? 'Open the wallet with your fingerprint or face instead of typing the PIN. The PIN is still asked for every send.'
            : 'Log in with "Remember username" and "Keep me logged in" on to use this.'
        }
        right={
          <Switch
            value={enabled}
            disabled={!sessionSaved || !savedUsername}
            onValueChange={async (value) => {
              if (!value) {
                await disableBiometricUnlock(savedUsername);
                setEnabled(false);
                return;
              }
              const pin = await confirmPin({});
              if (!pin) return;
              try {
                const ok = await enableBiometricUnlock(savedUsername, pin);
                setEnabled(ok);
                if (ok) showNotification('Fingerprint / face unlock is on');
              } catch (err) {
                showError(err?.message);
              }
            }}
          />
        }
      />
    </>
  );
}

export default function ApplicationSettings() {
  const loggedIn = useSelector(selectLoggedIn);
  const colorScheme = useSelector(selectSetting('colorScheme'));
  const baseCurrency = useSelector(selectSetting('baseCurrency'));
  const hideBalances = useSelector(selectSetting('hideBalances'));
  const ignoreSyncScreen = useSelector(selectSetting('ignoreSyncScreen'));
  const hideUnusedTrustAccount = useSelector(
    selectSetting('hideUnusedTrustAccount')
  );
  const pricePer = formatNumber(
    useSelector(({ market: { price } }) => price),
    { maximumFractionDigits: baseCurrency === 'VND' ? 0 : 3 }
  );

  return (
    <>
      <Text style={styles.title} sub>
        Application
      </Text>
      <Surface style={styles.section}>
        <Select
          options={themeOptions}
          value={colorScheme}
          updateValue={(colorScheme) => {
            updateSettings({ colorScheme });
          }}
          render={({ display, openSelect }) => (
            <SettingItem
              title="Color scheme"
              description={display}
              primary
              onPress={openSelect}
            />
          )}
        />

        {loggedIn && (
          <>
            <Divider inset={20} />
            <Select
              options={baseCurrencies}
              value={baseCurrency}
              updateValue={(baseCurrency) => {
                updateSettings({ baseCurrency });
              }}
              render={({ display, openSelect }) => (
                <SettingItem
                  title="Base currency"
                  description={`${display}  ${pricePer}/NXS`}
                  primary
                  onPress={openSelect}
                />
              )}
            />

            <Divider inset={20} />
            <SettingItem
              title="Hide balances"
              description="Hide balances on Overview screen"
              right={
                <Switch
                  value={hideBalances}
                  onValueChange={(hideBalances) => {
                    updateSettings({ hideBalances });
                  }}
                />
              }
            />

            <Divider inset={20} />
            <SettingItem
              title="Hide unused trust account"
              description="Hide trust account on Overview screen if account is not used"
              right={
                <Switch
                  value={hideUnusedTrustAccount}
                  onValueChange={(hideUnusedTrustAccount) => {
                    updateSettings({ hideUnusedTrustAccount });
                  }}
                />
              }
            />
            <BiometricSetting />
          </>
        )}

        <SettingItem
          title="Ignore database initialization"
          description="Don't show the 'Initializing database' screen when the app initializes the blockchain database."
          right={
            <Switch
              value={ignoreSyncScreen}
              onValueChange={(value) => {
                updateSettings({ ignoreSyncScreen: !!value });
              }}
            />
          }
        />
      </Surface>
    </>
  );
}

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

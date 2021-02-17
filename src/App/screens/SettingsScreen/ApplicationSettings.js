import React from 'react';
import { useSelector } from 'react-redux';
import { Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import Select from 'components/Select';
import Text from 'components/Text';
import Switch from 'components/Switch';
import { updateSettings, selectSettings } from 'lib/settings';
import { selectLoggedIn } from 'lib/user';
import baseCurrencies from 'consts/baseCurrencies';
import SettingItem from './SettingItem';
import commonStyles from './styles';

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
  const settings = useSelector(
    selectSettings(['colorScheme', 'baseCurrency', 'hideBalances'])
  );

  return (
    <>
      <Text style={styles.title} sub>
        Application
      </Text>
      <Surface style={styles.section}>
        <Select
          options={themeOptions}
          value={settings.colorScheme}
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
              value={settings.baseCurrency}
              updateValue={(baseCurrency) => {
                updateSettings({ baseCurrency });
              }}
              render={({ display, openSelect }) => (
                <SettingItem
                  title="Base currency"
                  description={display}
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
                  value={settings.hideBalances}
                  onValueChange={(hideBalances) => {
                    updateSettings({ hideBalances });
                  }}
                />
              }
            />
          </>
        )}
      </Surface>
    </>
  );
}

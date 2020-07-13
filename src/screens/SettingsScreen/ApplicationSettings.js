import React from 'react';
import { useSelector } from 'react-redux';

import Divider from 'components/Divider';
import Switch from 'components/Switch';
import Select from 'components/Select';
import { updateSettings } from 'lib/settings';
import baseCurrencies from 'consts/baseCurrencies';
import SettingItem from './SettingItem';

const styles = {
  switch: {
    marginLeft: 10,
  },
};

export default function ApplicationSettings() {
  const settings = useSelector((state) => state.settings);
  const toggleDarkMode = React.useCallback(() => {
    updateSettings({ darkMode: !settings.darkMode });
  }, [settings.darkMode]);
  const setBaseCurrency = React.useCallback(
    (baseCurrency) => {
      updateSettings({ baseCurrency });
    },
    [settings.baseCurrency]
  );

  return (
    <>
      <SettingItem
        title="Dark mode"
        description={settings.darkMode ? 'On' : 'Off'}
        primary
        onPress={toggleDarkMode}
        right={
          <Switch
            style={styles.switch}
            value={settings.darkMode}
            onValueChange={toggleDarkMode}
          />
        }
      />
      <Divider inset={20} />
      <Select
        options={baseCurrencies}
        value={settings.baseCurrency}
        updateValue={setBaseCurrency}
        render={({ display, openSelect }) => (
          <SettingItem
            title="Base currency"
            description={display}
            primary
            onPress={openSelect}
          />
        )}
      />
    </>
  );
}

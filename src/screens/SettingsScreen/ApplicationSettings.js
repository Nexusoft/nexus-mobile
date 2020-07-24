import React from 'react';
import { useSelector } from 'react-redux';
import { Surface } from 'react-native-paper';

import Divider from 'components/Divider';
import Switch from 'components/Switch';
import Select from 'components/Select';
import Text from 'components/Text';
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

export default function ApplicationSettings() {
  const loggedIn = useSelector(selectLoggedIn);
  const settings = useSelector(selectSettings);
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
      <Text style={styles.title} sub>
        Application
      </Text>
      <Surface style={styles.section}>
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
        {loggedIn && (
          <>
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
        )}
      </Surface>
    </>
  );
}

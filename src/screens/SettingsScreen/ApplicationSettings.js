import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useTheme } from 'lib/theme';

import Text from 'components/Text';
import Divider from 'components/Divider';
import Switch from 'components/Switch';
import Select from 'components/Select';
import { updateSettings } from 'lib/settings';
import baseCurrencies from 'consts/baseCurrencies';

const styles = {
  setting: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontSize: 18,
  },
  description: {
    fontSize: 14,
    marginTop: 3,
  },
  switch: {
    paddingHorizontal: 10,
  },
};

function SettingSelect({ title, options, value, updateValue }) {
  const theme = useTheme();
  return (
    <Select
      options={options}
      value={value}
      updateValue={updateValue}
      render={({ value, openSelect }) => (
        <TouchableRipple borderless={false} onPress={openSelect}>
          <View style={styles.setting}>
            <View style={styles.settingInfo}>
              <Text style={styles.label}>{title}</Text>
              <Text style={[styles.description, { color: theme.primary }]}>
                {options[value]}
              </Text>
            </View>
          </View>
        </TouchableRipple>
      )}
    />
  );
}

export default function ApplicationSettings() {
  const theme = useTheme();
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
    <View>
      <TouchableRipple borderless={false} onPress={toggleDarkMode}>
        <View style={styles.setting}>
          <View style={styles.settingInfo}>
            <Text style={styles.label}>Dark mode</Text>
            <Text style={[styles.description, { color: theme.primary }]}>
              On
            </Text>
          </View>
          <View style={styles.switch}>
            <Switch value={settings.darkMode} onValueChange={toggleDarkMode} />
          </View>
        </View>
      </TouchableRipple>
      <Divider inset={20} />
      <SettingSelect
        title="Base currency"
        options={baseCurrencies}
        value={settings.baseCurrency}
        updateValue={setBaseCurrency}
      />
    </View>
  );
}

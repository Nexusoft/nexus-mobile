import React from 'react';
import styled from '@emotion/native';
import { TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { Text } from 'components/Adaptive';
import Divider from 'components/Divider';
import Switch from 'components/Switch';
import Select from 'components/Select';
import { updateSettings } from 'lib/settings';
import baseCurrencies from 'consts/baseCurrencies';

const Wrapper = styled.View({
  // flex: 1,
  // paddingVertical: 20,
});

const Setting = styled.View({
  paddingVertical: 20,
  paddingHorizontal: 20,
  flexDirection: 'row',
  alignItems: 'center',
});

const SettingText = styled.View({
  flex: 1,
  paddingRight: 10,
});

const SettingLabel = styled(Text)({
  fontSize: 18,
});

const SettingDescription = styled(Text)(({ theme, primary }) => ({
  color: primary ? theme.primary : undefined,
  fontSize: 14,
  marginTop: 3,
}));

const SettingSwitch = styled.View({
  paddingHorizontal: 10,
});

const SettingSelect = ({ title, options, value, updateValue }) => (
  <Select
    options={options}
    value={value}
    updateValue={updateValue}
    render={({ value, openSelect }) => (
      <TouchableRipple borderless={false} onPress={openSelect}>
        <Setting>
          <SettingText>
            <SettingLabel>{title}</SettingLabel>
            <SettingDescription primary>{options[value]}</SettingDescription>
          </SettingText>
        </Setting>
      </TouchableRipple>
    )}
  />
);

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
    <Wrapper>
      <TouchableRipple borderless={false} onPress={toggleDarkMode}>
        <Setting>
          <SettingText>
            <SettingLabel>Dark mode</SettingLabel>
            <SettingDescription primary>On</SettingDescription>
          </SettingText>
          <SettingSwitch>
            <Switch value={settings.darkMode} onValueChange={toggleDarkMode} />
          </SettingSwitch>
        </Setting>
      </TouchableRipple>
      <Divider inset={20} />
      <SettingSelect
        title="Base currency"
        options={baseCurrencies}
        value={settings.baseCurrency}
        updateValue={setBaseCurrency}
      />
    </Wrapper>
  );
}

import React from 'react';
import {
  TouchableRipple,
  RadioButton,
  Portal,
  Dialog,
} from 'react-native-paper';
import styled from '@emotion/native';
import { useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'emotion-theming';

import { Text } from 'components/StyledText';
import Switch from 'components/Switch';
import Divider from 'components/Divider';
import { updateSettings } from 'lib/settings';
import baseCurrencies from 'consts/baseCurrencies';

const Wrapper = styled.View({
  // flex: 1,
  // paddingVertical: 20,
});

const SettingDivider = styled(Divider)({
  marginHorizontal: 20,
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

const StyledSettingLabel = styled(Text)({
  fontSize: 18,
});

const SettingLabel = (props) => <StyledSettingLabel emphasis {...props} />;

const SettingDescription = styled(Text)({
  fontSize: 14,
  marginTop: 3,
});

const SettingSwitch = styled.View({
  paddingHorizontal: 10,
});

const SettingSelectDialog = styled(Dialog)({
  marginVertical: 50,
});

const SettingSelect = ({ title, options, value, updateValue }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  return (
    <TouchableRipple
      borderless={false}
      onPress={() => {
        setOpen(true);
      }}
    >
      <Setting>
        <SettingText>
          <SettingLabel>{title}</SettingLabel>
          <SettingDescription primary>{options[value]}</SettingDescription>
        </SettingText>
        <Portal>
          <SettingSelectDialog
            visible={open}
            onDismiss={() => {
              setOpen(false);
            }}
          >
            <ScrollView>
              <RadioButton.Group
                value={value}
                onValueChange={(value) => {
                  updateValue(value);
                  setOpen(false);
                }}
              >
                {Object.entries(options).map(([value, display]) => (
                  <RadioButton.Item
                    key={value}
                    value={value}
                    color={theme.primary}
                    uncheckedColor={theme.foregroundEmphasis}
                    label={display}
                    labelStyle={{
                      color: theme.foregroundEmphasis,
                    }}
                  />
                ))}
              </RadioButton.Group>
            </ScrollView>
          </SettingSelectDialog>
        </Portal>
      </Setting>
    </TouchableRipple>
  );
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
      <SettingDivider />
      <SettingSelect
        title="Base currency"
        options={baseCurrencies}
        value={settings.baseCurrency}
        updateValue={setBaseCurrency}
      />
    </Wrapper>
  );
}

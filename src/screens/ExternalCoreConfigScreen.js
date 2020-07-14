import React from 'react';
import { View, TextInput } from 'react-native';
import { Surface } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import Divider from 'components/Divider';
import { useTheme, disabledColor } from 'lib/theme';
import { defaultSettings } from 'lib/settings';

const styles = {
  screen: {
    paddingTop: 30,
  },
  section: {
    elevation: 2,
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    marginTop: 30,
    marginBottom: 15,
    marginHorizontal: 20,
    textTransform: 'uppercase',
  },
  field: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 110,
  },
  textbox: {
    paddingVertical: 5,
    flex: 1,
    fontSize: 15,
  },
};

function TextBox({ style, ...rest }) {
  const theme = useTheme();
  return (
    <TextInput
      autoCorrect={false}
      autoCapitalize="none"
      keyboardAppearance={theme.dark ? 'dark' : 'light'}
      placeholderTextColor={disabledColor(theme.foreground)}
      style={[styles.textbox, { color: theme.foreground }, style]}
      {...rest}
    />
  );
}

export default function ExternalCoreConfigScreen() {
  return (
    <ScreenBody style={styles.screen}>
      <Surface style={styles.section}>
        <View style={styles.field}>
          <Text style={styles.label}>IP address</Text>
          <TextBox placeholder={defaultSettings.externalCoreIP} />
        </View>
      </Surface>

      <Text sub style={styles.title}>
        API server
      </Text>
      <Surface style={styles.section}>
        <View style={styles.field}>
          <Text style={styles.label}>API port</Text>
          <TextBox placeholder={defaultSettings.externalCoreRPCPort} />
        </View>
        <Divider inset={20} />
        <View style={styles.field}>
          <Text style={styles.label}>API username</Text>
          <TextBox placeholder={defaultSettings.externalCoreRPCUser} />
        </View>
        <Divider inset={20} />
        <View style={styles.field}>
          <Text style={styles.label}>API password</Text>
          <TextBox placeholder={defaultSettings.externalCoreRPCPassword} />
        </View>
      </Surface>

      <Text sub style={styles.title}>
        RPC server
      </Text>
      <Surface style={styles.section}>
        <View style={styles.field}>
          <Text style={styles.label}>RPC port</Text>
          <TextBox placeholder={defaultSettings.externalCoreAPIPort} />
        </View>
        <Divider inset={20} />
        <View style={styles.field}>
          <Text style={styles.label}>RPC username</Text>
          <TextBox placeholder={defaultSettings.externalCoreAPIUser} />
        </View>
        <Divider inset={20} />
        <View style={styles.field}>
          <Text style={styles.label}>RPC password</Text>
          <TextBox placeholder={defaultSettings.externalCoreAPIPassword} />
        </View>
      </Surface>
    </ScreenBody>
  );
}

ExternalCoreConfigScreen.nav = {
  name: 'ExternalCoreConfig',
  options: {
    title: 'External Core',
  },
};

import React from 'react';
import { View, TextInput } from 'react-native';
import { Surface, Button } from 'react-native-paper';
import { Formik, useField } from 'formik';
import { useSelector } from 'react-redux';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import Switch from 'components/Switch';
import Divider from 'components/Divider';
import { useTheme, disabledColor } from 'lib/theme';
import { defaultSettings, updateSettings, selectSetting } from 'lib/settings';
import { goBack } from 'lib/navigation';
import { showError } from 'lib/ui';
import { refreshCoreInfo } from 'lib/coreInfo';

const styles = {
  screen: {
    paddingTop: 20,
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
  description: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  field: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    width: 120,
    fontSize: 14,
  },
  textbox: {
    paddingVertical: 5,
    flex: 1,
    fontSize: 14,
  },
};

function TextBox({ name, style, ...rest }) {
  const theme = useTheme();
  const [field, meta, helpers] = useField(name);
  return (
    <TextInput
      autoCorrect={false}
      autoCapitalize="none"
      keyboardAppearance={theme.dark ? 'dark' : 'light'}
      placeholderTextColor={disabledColor(theme.foreground)}
      style={[styles.textbox, { color: theme.foreground }, style]}
      value={field.value}
      onChangeText={helpers.setValue}
      onBlur={() => {
        helpers.setTouched(true);
      }}
      {...rest}
    />
  );
}

function ExternalCoreConfigForm({ navigation, isSubmitting, handleSubmit }) {
  const coreMode = useSelector(selectSetting('coreMode'));
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button mode="text" disabled={isSubmitting} onPress={handleSubmit}>
          Done
        </Button>
      ),
    });
  }, []);

  return (
    <>
      <Surface style={styles.section}>
        <View style={[styles.field, { justifyContent: 'space-between' }]}>
          <Text style={styles.label}>
            {coreMode === 'external' ? 'On' : 'Off'}
          </Text>
          <Switch
            value={coreMode === 'external'}
            onValueChange={(value) => {
              console.log('value', value);
              updateSettings({ coreMode: value ? 'external' : 'embedded' });
            }}
          />
        </View>
      </Surface>

      <Text sub style={styles.description}>
        Manually connect to an external Nexus Core you run on another machine
        instead of the internal Nexus Core delivered along with this app. Be
        aware of possible version incompatibility between the app interface and
        the Nexus Core
      </Text>

      {coreMode === 'external' && (
        <>
          <Surface style={styles.section}>
            <View style={styles.field}>
              <Text style={styles.label}>IP address</Text>
              <TextBox
                name="externalCoreIP"
                placeholder={defaultSettings.externalCoreIP}
                keyboardType="decimal-pad"
              />
            </View>
          </Surface>

          <Text sub style={styles.title}>
            API server
          </Text>
          <Surface style={styles.section}>
            <View style={styles.field}>
              <Text style={styles.label}>API port</Text>
              <TextBox
                name="externalCoreAPIPort"
                placeholder={defaultSettings.externalCoreAPIPort}
                keyboardType="number-pad"
              />
            </View>
            <Divider inset={20} />
            <View style={styles.field}>
              <Text style={styles.label}>API username</Text>
              <TextBox
                name="externalCoreAPIUser"
                placeholder={defaultSettings.externalCoreAPIUser}
              />
            </View>
            <Divider inset={20} />
            <View style={styles.field}>
              <Text style={styles.label}>API password</Text>
              <TextBox
                name="externalCoreAPIPassword"
                placeholder={defaultSettings.externalCoreAPIPassword}
                secureTextEntry
              />
            </View>
          </Surface>
        </>
      )}
    </>
  );
}

export default function ExternalCoreConfigScreen({ navigation }) {
  const {
    externalCoreIP,
    externalCoreAPIPort,
    externalCoreAPIUser,
    externalCoreAPIPassword,
  } = useSelector((state) => state.settings);
  return (
    <ScreenBody style={styles.screen}>
      <Formik
        initialValues={{
          externalCoreIP,
          externalCoreAPIPort,
          externalCoreAPIUser,
          externalCoreAPIPassword,
        }}
        onSubmit={async (updates) => {
          try {
            for (const key of Object.keys(updates)) {
              if (updates[key] === '') updates[key] = null;
            }
            await updateSettings(updates);
          } catch (err) {
            showError(err && err.message);
            return;
          }
          refreshCoreInfo();
          goBack();
        }}
      >
        {(props) => (
          <ExternalCoreConfigForm {...props} navigation={navigation} />
        )}
      </Formik>
    </ScreenBody>
  );
}

ExternalCoreConfigScreen.nav = {
  name: 'ExternalCoreConfig',
  options: {
    title: 'External Core',
  },
};

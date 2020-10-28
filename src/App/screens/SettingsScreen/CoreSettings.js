import React from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { TouchableRipple, Surface } from 'react-native-paper';

import Text from 'components/Text';
import { updateSettings, selectSettings } from 'lib/settings';
import { navigate } from 'lib/navigation';
import { useTheme } from 'lib/theme';
import { refreshCoreInfo } from 'lib/coreInfo';
import SettingItem from './SettingItem';
import commonStyles from './styles';

const styles = {
  ...commonStyles,
  coreModeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: 25,
  },
  coreModeSelector: ({ theme }) => ({
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.primary,
    flexDirection: 'row',
  }),
};

function CoreMode({ label, value }) {
  const theme = useTheme();
  const { coreMode } = useSelector(selectSettings);
  const active = coreMode === value;
  const content = (
    <View
      style={{
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: active ? theme.primary : undefined,
        alignItems: 'center',
      }}
    >
      <Text style={{ color: active ? theme.onPrimary : theme.foreground }}>
        {label}
      </Text>
    </View>
  );

  if (active) {
    return content;
  } else {
    return (
      <TouchableRipple
        onPress={async () => {
          await updateSettings({ coreMode: value });
          refreshCoreInfo();
        }}
      >
        {content}
      </TouchableRipple>
    );
  }
}

export default function CoreSettings() {
  const theme = useTheme();
  const settings = useSelector(selectSettings);

  return (
    <>
      <Text style={styles.title} sub>
        Core
      </Text>
      <View style={styles.coreModeWrapper}>
        <View style={styles.coreModeSelector({ theme })}>
          <CoreMode value="embedded" label="Embedded Core" />
          <CoreMode value="external" label="External Core" />
        </View>
      </View>
      <Surface style={styles.section}>
        {settings.coreMode === 'external' && (
          <>
            <SettingItem
              small
              title="External Core configuration"
              right="arrow"
              onPress={() => {
                navigate('ExternalCoreConfig');
              }}
            />
          </>
        )}
        {
          settings.coreMode === 'embedded' && (
            <SettingItem
              small
              title="Core Log"
              right="arrow"
              onPress={() => {
                navigate('EmbeddedCoreLogReader');
              }} />
          )
        }
      </Surface>
    </>
  );
}

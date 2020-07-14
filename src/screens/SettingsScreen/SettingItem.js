import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import Text from 'components/Text';
import { useTheme } from 'lib/theme';

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
  description: {
    fontSize: 14,
    marginTop: 3,
  },
};

export default function SettingItem({
  title,
  small,
  description,
  primary,
  onPress,
  right,
}) {
  const theme = useTheme();
  const fontSize = small ? 16 : 18;
  return (
    <TouchableRipple borderless={false} onPress={onPress}>
      <View style={styles.setting}>
        <View style={styles.settingInfo}>
          <Text style={{ fontSize }}>{title}</Text>
          {!!description && (
            <Text
              style={[
                styles.description,
                primary ? { color: theme.primary } : null,
              ]}
            >
              {description}
            </Text>
          )}
        </View>
        {right === 'arrow' ? (
          <Ionicons
            name="ios-arrow-forward"
            style={{ fontSize, color: theme.foreground }}
          />
        ) : (
          right
        )}
      </View>
    </TouchableRipple>
  );
}

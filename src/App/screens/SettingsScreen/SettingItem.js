import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import { useTheme } from 'lib/theme';
import RightArrowIcon from 'icons/chevron-right.svg';

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
          <SvgIcon
            size={fontSize * 0.66}
            icon={RightArrowIcon}
            color={theme.foreground}
          />
        ) : (
          right
        )}
      </View>
    </TouchableRipple>
  );
}

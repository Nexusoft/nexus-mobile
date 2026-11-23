import React from 'react';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import { useTheme } from 'lib/theme';

const style = ({ theme, active }) => ({
  borderRadius: 16,
  paddingHorizontal: 14,
  paddingVertical: 6,
  marginRight: 8,
  backgroundColor: active
    ? theme.primary
    : theme.dark
    ? theme.surface
    : '#eef2f7',
});

export default function Chip({ label, active, onPress }) {
  const theme = useTheme();
  return (
    <TouchableRipple
      style={style({ theme, active })}
      borderless
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
    >
      <Text
        bold={active}
        size={13}
        colorName={active ? 'onPrimary' : 'foreground'}
      >
        {label}
      </Text>
    </TouchableRipple>
  );
}

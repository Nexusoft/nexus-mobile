import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'lib/theme';

import { fade } from 'utils/color';

export default function Divider({
  color,
  vertical,
  inset,
  spacing,
  style,
  ...rest
}) {
  const theme = useTheme();
  return (
    <View
      style={[
        { backgroundColor: fade(color || theme.foreground, 0.85) },
        vertical
          ? {
              width: 1,
              marginTop: Array.isArray(inset) ? inset[0] : inset,
              marginBottom: Array.isArray(inset) ? inset[1] : inset,
              marginLeft: Array.isArray(spacing) ? spacing[0] : spacing,
              marginRight: Array.isArray(spacing) ? spacing[1] : spacing,
            }
          : {
              height: 1,
              marginLeft: Array.isArray(inset) ? inset[0] : inset,
              marginRight: Array.isArray(inset) ? inset[1] : inset,
              marginTop: Array.isArray(spacing) ? spacing[0] : spacing,
              marginBottom: Array.isArray(spacing) ? spacing[1] : spacing,
            },
        style,
      ]}
      {...rest}
    />
  );
}

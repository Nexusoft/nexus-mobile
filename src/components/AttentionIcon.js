import React from 'react';
import { View } from 'react-native';

import SvgIcon from 'components/SvgIcon';
import { useTheme } from 'lib/theme';
import WarningIcon from 'icons/warning-circle.svg';

export default function AttentionIcon({ style, ...rest }) {
  const theme = useTheme();
  return (
    <View style={[style]} {...rest}>
      <View
        style={{
          position: 'absolute',
          top: 1,
          left: 1,
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: theme.onDanger,
        }}
      />
      <SvgIcon icon={WarningIcon} size={12} color={theme.danger} />
    </View>
  );
}

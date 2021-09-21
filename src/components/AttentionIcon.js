import React from 'react';

import SvgIcon from 'components/SvgIcon';
import { useTheme } from 'lib/theme';
import WarningIcon from 'icons/warning-circle.svg';

export default function AttentionIcon({ style, size = 12, ...rest }) {
  const theme = useTheme();
  return (
    <SvgIcon
      icon={WarningIcon}
      style={[
        {
          backgroundColor: theme.onDanger,
          overflow: 'hidden',
          borderRadius: size / 2,
        },
        style,
      ]}
      size={size}
      color={theme.danger}
      {...rest}
    />
  );
}

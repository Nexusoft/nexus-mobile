import React from 'react';

import SvgIcon from 'components/SvgIcon';
import { useTheme } from 'lib/theme';
import WarningIcon from 'icons/warning-circle.svg';

const defaultStyle = ({ theme, size }) => ({
  position: 'absolute',
  backgroundColor: theme.onDanger,
  overflow: 'hidden',
  borderRadius: size / 2,
});

export default function AttentionIcon({ style, ...rest }) {
  const theme = useTheme();
  const size = rest.size || 12;
  return (
    <SvgIcon
      icon={WarningIcon}
      style={{ ...defaultStyle({ theme, size }), ...style }}
      size={size}
      color={theme.danger}
    />
  );
}

import React from 'react';
import { useTheme } from 'emotion-theming';

import resolveColor from 'utils/resolveColor';

export default ({
  icon: Component,
  size,
  color,
  colorName,
  sub,
  disabled,
  ...rest
}) => {
  const theme = useTheme();
  const iconColor = color || resolveColor(colorName, { sub, disabled }, theme);
  return (
    <Component
      width={size}
      height={size}
      style={{ color: iconColor }}
      {...rest}
    />
  );
};

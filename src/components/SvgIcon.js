import React from 'react';
import { useTheme } from 'emotion-theming';

import { disabledColor, subColor } from 'lib/theme';

export default ({
  icon: Icon,
  size,
  color,
  colorName,
  sub,
  disabled,
  ...rest
}) => {
  const theme = useTheme();
  const baseColor = color || theme[colorName] || theme.foreground;
  const iconColor = disabled
    ? disabledColor(baseColor)
    : sub
    ? subColor(baseColor)
    : baseColor;
  return (
    <Icon
      {...(size ? { width: size, height: size } : null)}
      {...rest}
      style={[{ color: iconColor }, rest.style]}
    />
  );
};

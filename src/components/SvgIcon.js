import React from 'react';
import { useTheme } from 'emotion-theming';

import { disabledColor, subColor } from 'lib/theme';

export default React.forwardRef(function SvgIcon(
  { icon: Icon, size, color, colorName = 'foreground', sub, disabled, ...rest },
  ref
) {
  const theme = useTheme();
  const baseColor = color || (colorName ? theme[colorName] : undefined);
  const iconColor = disabled
    ? disabledColor(baseColor)
    : sub
    ? subColor(baseColor)
    : baseColor;
  return (
    <Icon
      ref={ref}
      {...(size ? { width: size, height: size } : null)}
      {...rest}
      style={[{ color: iconColor }, rest.style]}
    />
  );
});

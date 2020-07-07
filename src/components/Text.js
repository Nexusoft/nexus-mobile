import React from 'react';
import { Text as NativeText } from 'react-native';
import { useTheme } from 'emotion-theming';

import { disabledColor, subColor } from 'lib/theme';

export default React.forwardRef(function Text(
  {
    mono,
    bold,
    size,
    color,
    colorName = 'foreground',
    sub,
    disabled,
    style,
    ...rest
  },
  ref
) {
  const theme = useTheme();
  const baseColor = color || (colorName ? theme[colorName] : undefined);
  const textColor = disabled
    ? disabledColor(baseColor)
    : sub
    ? subColor(baseColor)
    : baseColor;
  return (
    <NativeText
      ref={ref}
      style={[
        {
          fontFamily: mono
            ? 'robotomono'
            : bold
            ? 'noto-sans-bold'
            : 'noto-sans',
          fontWeight: bold ? 'bold' : 'normal',
          fontSize: size,
          color: textColor,
        },
        style,
      ]}
      {...rest}
    />
  );
});

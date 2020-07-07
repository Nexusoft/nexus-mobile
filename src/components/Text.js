import { Text as NativeText } from 'react-native';
import styled from '@emotion/native';
import { disabledColor, subColor } from 'lib/theme';

const Text = styled(NativeText)(
  ({
    mono,
    bold,
    size,
    theme,
    color,
    colorName = 'foreground',
    sub,
    disabled,
  }) => {
    const baseColor = color || (colorName ? theme[colorName] : undefined);
    const textColor = disabled
      ? disabledColor(baseColor)
      : sub
      ? subColor(baseColor)
      : baseColor;
    return {
      fontFamily: mono ? 'robotomono' : bold ? 'noto-sans-bold' : 'noto-sans',
      fontWeight: bold ? 'bold' : 'normal',
      fontSize: size,
      color: textColor,
    };
  }
);

export default Text;

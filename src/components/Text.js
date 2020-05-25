import React from 'react';
import styled from '@emotion/native';

import { subColor, disabledColor } from 'utils/color';

const Text = styled.Text(
  ({ theme, mono, bold, sub, disabled, colorName = 'foreground' }) => {
    const color = theme[colorName];
    return {
      fontFamily: mono ? 'robotomono' : bold ? 'noto-sans-bold' : 'noto-sans',
      color: disabled ? disabledColor(color) : sub ? subColor(color) : color,
      fontWeight: bold ? 'bold' : 'normal',
    };
  }
);

Text.template = (colorName, options) => (props) => {
  if (typeof colorName === 'object') {
    options = colorName;
    colorName = undefined;
  }
  const { font, modifier, weight } = options;

  return (
    <Text
      colorName={colorName}
      mono={font === 'mono'}
      bold={weight === 'bold'}
      sub={modifier === 'sub'}
      disabled={modifier === 'disabled'}
      {...props}
    />
  );
};

export default Text;

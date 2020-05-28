import React from 'react';
import styled from '@emotion/native';

import resolveColor from 'utils/resolveColor';

const Text = styled.Text(
  ({ theme, mono, bold, sub, disabled, colorName = 'foreground' }) => ({
    fontFamily: mono ? 'robotomono' : bold ? 'noto-sans-bold' : 'noto-sans',
    color: resolveColor(colorName, { sub, disabled }, theme),
    fontWeight: bold ? 'bold' : 'normal',
  })
);

Text.template = (colorName, options) => {
  if (typeof colorName === 'object') {
    options = colorName;
    colorName = undefined;
  }
  options = options || {};

  return (props) => {
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
};

export default Text;

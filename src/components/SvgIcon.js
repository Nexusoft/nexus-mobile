import React from 'react';

import useColorName from 'hooks/useColorName';

export default ({
  icon: Component,
  size,
  colorName,
  sub,
  disabled,
  ...rest
}) => {
  const color = useColorName(colorName, { sub, disabled });
  return <Component width={size} height={size} style={{ color }} {...rest} />;
};

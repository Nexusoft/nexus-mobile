import React from 'react';

export default ({ icon: Icon, size, color, ...rest }) => (
  <Icon width={size} height={size} {...rest} style={[{ color }, rest.style]} />
);

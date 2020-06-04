import React from 'react';

export default ({ icon: Icon, size, color, ...rest }) => (
  <Icon
    {...(size ? { width: size, height: size } : null)}
    {...rest}
    style={[{ color }, rest.style]}
  />
);

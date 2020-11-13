import React from 'react';

import Text from 'components/Text';

export const getTokenName = (
  { token_name, token },
  { markup } = { markup: true }
) => {
  if (token_name) return token_name;
  if (typeof token === 'string') {
    if (markup) {
      return <Text style={{ opacity: 0.5 }}>{token.substring(0, 3)}…</Text>;
    } else {
      return token.substring(0, 3) + '…';
    }
  }
  return 'NXS';
};

import React from 'react';

import Text from 'components/Text';
import { t } from 'lib/i18n';

const getToken = ({ token, account, contract }) => {
  if (token) return token;
  const obj = account || contract;
  return { name: obj?.ticker || obj?.token_name, address: obj?.token };
};

const trimAddress = (address) => (address ? address.substring(0, 3) + '…' : '');

const nameText = ({ name, address, verbose }) =>
  name ||
  (verbose
    ? t('{token} token', { token: trimAddress(address) })
    : trimAddress(address));

export default function TokenName({
  token,
  account,
  contract,
  verbose = false,
  ...rest
}) {
  const { name, address } = getToken({ token, account, contract });

  return (
    <Text sub={!name} {...rest}>
      {nameText({ name, address, verbose })}
    </Text>
  );
}

TokenName.from = ({ token, account, contract, verbose = false }) => {
  const { name, address } = getToken({ token, account, contract });
  return nameText({ name, address, verbose });
};

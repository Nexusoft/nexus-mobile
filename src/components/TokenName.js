import React from 'react';

import Text from 'components/Text';

const getToken = ({ token, account, contract }) => {
  if (token) return token;
  const obj = account || contract;
  return { name: obj?.token_name, address: obj?.token };
};

const trimAddress = (address) => (address ? address.substring(0, 3) + '…' : '');

export default function TokenName({ token, account, contract, ...rest }) {
  const { name, address } = getToken({ token, account, contract });

  return (
    <Text sub={!name} {...rest}>
      {name || trimAddress(address)}
    </Text>
  );
}

TokenName.from = ({ token, account, contract }) => {
  const { name, address } = getToken({ token, account, contract });
  return name || trimAddress(address);
};

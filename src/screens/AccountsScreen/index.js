import React from 'react';
import { SafeAreaView } from 'react-native';
import styled from '@emotion/native';
import { ScrollView } from 'react-native-gesture-handler';

import AccountDetails from './AccountDetails';

const accounts = [
  {
    created: 1573539403,
    modified: 1589688048,
    name: 'default',
    address: '8BJhfDBEhs73RYmUeM6YRvamRHWP6zjoaSjPRkGbxsFAuiXTuGW',
    token_name: 'NXS',
    token: '0',
    balance: 0,
    pending: 0,
    unconfirmed: 0,
  },
  {
    created: 1573539403,
    modified: 1591674440,
    name: 'trust',
    address: '8Gbwm4sH9VttWNLpyuXe4zjH1wf5UFxkjjnuGjihPqsdodVBcwk',
    token_name: 'NXS',
    token: '0',
    balance: 44.745334,
    pending: 0,
    unconfirmed: 0,
    stake: 40397,
  },
];

const Wrapper = styled(ScrollView)({
  flex: 1,
});

export default function AccountsScreen() {
  return (
    <Wrapper>
      <SafeAreaView>
        {accounts.map((account) => (
          <AccountDetails key={account.address} account={account} />
        ))}
      </SafeAreaView>
    </Wrapper>
  );
}

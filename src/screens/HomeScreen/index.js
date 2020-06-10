import React from 'react';
import { shadow } from 'react-native-paper';
import styled from '@emotion/native';
import { ScrollView } from 'react-native-gesture-handler';

import { Surface, View, SubText } from 'components/Typo';
import BalanceSection from './BalanceSection';
import Account from './Account';

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

const Container = styled(View)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.dark ? theme.background : theme.primary,
}));

const AccountsPane = styled(Surface)(({ theme }) => ({
  flex: 1,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  paddingHorizontal: 40,
  elevation: theme.dark ? 1 : 8,
  ...shadow(theme.dark ? 1 : 6),
}));

const SubHeader = styled(SubText)({
  paddingVertical: 15,
  textTransform: 'uppercase',
  fontSize: 12,
  textAlign: 'center',
});

const Accounts = styled(ScrollView)({
  flex: 1,
});

export default function HomeScreen() {
  return (
    <Container>
      <BalanceSection />

      <AccountsPane>
        <SubHeader>Accounts</SubHeader>
        <Accounts>
          {accounts.map((account) => (
            <Account key={account.address} account={account} />
          ))}
        </Accounts>
      </AccountsPane>
    </Container>
  );
}

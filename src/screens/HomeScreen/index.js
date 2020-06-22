import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { shadow } from 'react-native-paper';
import styled from '@emotion/native';
import { ScrollView } from 'react-native-gesture-handler';

import { View, SubText } from 'components/Adaptive';
import { navigate } from 'lib/navigation';
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

const AccountsPane = styled(View)(({ theme }) => ({
  flex: 1,
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  paddingHorizontal: 40,
  backgroundColor: theme.surface,
  elevation: 8,
  ...shadow(8),
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
        <TouchableWithoutFeedback
          onPress={() => {
            navigate('Accounts');
          }}
        >
          <SubHeader>Accounts</SubHeader>
        </TouchableWithoutFeedback>
        <Accounts>
          {accounts.map((account) => (
            <Account key={account.address} account={account} />
          ))}
        </Accounts>
      </AccountsPane>
    </Container>
  );
}

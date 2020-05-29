import React from 'react';
import { shadow } from 'react-native-paper';
import styled from '@emotion/native';
import { ScrollView } from 'react-native-gesture-handler';

import { Surface, View, SubText } from 'components/Typo';
import BalanceSection from './BalanceSection';
import Account from './Account';

const Container = styled(View)(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.dark ? theme.background : theme.primary,
}));

const AccountsPane = styled(Surface)(({ theme }) => ({
  flex: 1,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  paddingHorizontal: 20,
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
          <Account account={{ name: 'default', balance: '2,232' }} />
          <Account account={{ name: 'trust', balance: '34,742.34' }} />
        </Accounts>
      </AccountsPane>
    </Container>
  );
}

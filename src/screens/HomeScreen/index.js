import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { shadow } from 'react-native-paper';
import styled from '@emotion/native';

import Text from 'components/Text';
import Divider from 'components/Divider';
import BalanceSection from './BalanceSection';
import Account from './Account';

const Container = styled.View(({ theme }) => ({
  flex: 1,
  backgroundColor: theme.dark ? theme.background : theme.primary,
}));

const AccountsPane = styled.View(({ theme }) => ({
  flex: 1,
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  backgroundColor: theme.surface,
  elevation: 6,
  ...shadow(6),
}));

const AccountsHeading = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 20,
  marginTop: 30,
  marginBottom: 10,
});

const SubHeader = styled(Text.template({ modifier: 'sub' }))({
  paddingVertical: 15,
  textTransform: 'uppercase',
  fontSize: 12,
  textAlign: 'center',
});

const AccountsDivider = styled(Divider)({
  flex: 1,
  marginTop: 3,
});

const AccountsHeadingLabel = styled(Text)(({ theme }) => ({
  backgroundColor: theme.background,
  paddingHorizontal: 15,
}));

const Accounts = styled(ScrollView)({
  flex: 1,
});

export default function HomeScreen() {
  return (
    <Container>
      <BalanceSection />

      <AccountsPane>
        {/*<AccountsHeading>
          <AccountsDivider />
          <AccountsHeadingLabel>Accounts</AccountsHeadingLabel>
          <AccountsDivider />
        </AccountsHeading>*/}
        <SubHeader>Accounts</SubHeader>
        <Accounts>
          <Account account={{ name: 'default', balance: '2,232' }} />
          <Account account={{ name: 'trust', balance: '34,742.34' }} />
        </Accounts>
      </AccountsPane>
    </Container>
  );
}

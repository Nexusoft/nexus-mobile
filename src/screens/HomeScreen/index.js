import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from '@emotion/native';

import { Text } from 'components/StyledText';
import Divider from 'components/Divider';
import Account from './Account';

const Container = styled(ScrollView)(({ theme }) => ({
  flex: 1,
  paddingVertical: 20,
}));

const BalanceSection = styled.View({
  paddingVertical: 20,
  alignItems: 'center',
});

const BalanceLabel = styled(Text)({
  fontSize: 12,
  textTransform: 'uppercase',
});

const Balance = styled(Text)({
  fontSize: 30,
});

const Value = styled(Text)({
  marginTop: 5,
  fontSize: 17,
});

const AccountsHeading = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginHorizontal: 20,
  marginTop: 30,
  marginBottom: 10,
});

const AccountsDivider = styled(Divider)({
  flex: 1,
  marginTop: 3,
});

const AccountsHeadingLabel = styled(Text)(({ theme }) => ({
  backgroundColor: theme.background,
  paddingHorizontal: 15,
}));

export default function HomeScreen() {
  return (
    <Container>
      <BalanceSection>
        <BalanceLabel emphasis>Balance</BalanceLabel>
        <Balance emphasis>10,435.643 NXS</Balance>
        <Value>≈ 1,931.32 USD</Value>
      </BalanceSection>

      <View>
        <AccountsHeading>
          <AccountsDivider />
          <AccountsHeadingLabel>Accounts</AccountsHeadingLabel>
          <AccountsDivider />
        </AccountsHeading>
        <Account account={{ name: 'default', balance: '2,232' }} />
        <Account account={{ name: 'trust', balance: '34,742.34' }} />
      </View>
    </Container>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

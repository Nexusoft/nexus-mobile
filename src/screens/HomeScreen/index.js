import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import styled from '@emotion/native';

import { Text } from 'components/StyledText';
import Divider from 'components/Divider';
import BalanceSection from './BalanceSection';
import Account from './Account';

const Container = styled(ScrollView)({
  flex: 1,
  paddingVertical: 20,
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
      <BalanceSection />

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

import React from 'react';
import styled from '@emotion/native';
import { TouchableRipple } from 'react-native-paper';

import { Text, Divider } from 'components/Typo';
import { navigate } from 'lib/navigation';

const AccountWrapper = styled.View({
  marginVertical: 10,
});

const AccountInfo = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 15,
});

const AccountName = styled(Text)(({ theme }) => ({
  fontSize: 15,
  color: theme.dark ? theme.primary : undefined,
}));

const AccountBalance = styled(Text)({
  fontSize: 15,
});

const AccountButtons = styled.View({
  flexDirection: 'row',
});

const AccountButton = styled(TouchableRipple)({
  flex: 1,
  alignItems: 'center',
  paddingVertical: 10,
});

const AccountButtonLabel = styled(Text)({
  fontSize: 11,
});

export default function Account({ account }) {
  return (
    <>
      <AccountWrapper>
        <AccountInfo>
          <AccountName bold>{account.name}</AccountName>
          <AccountBalance>{account.balance} NXS</AccountBalance>
        </AccountInfo>

        <AccountButtons>
          <AccountButton
            onPress={() => {
              navigate('Receive', { account });
            }}
          >
            <AccountButtonLabel>RECEIVE</AccountButtonLabel>
          </AccountButton>

          <Divider vertical inset={10} />

          <AccountButton
            onPress={() => {
              navigate('Send');
            }}
          >
            <AccountButtonLabel>SEND</AccountButtonLabel>
          </AccountButton>
        </AccountButtons>
      </AccountWrapper>
      <Divider />
    </>
  );
}

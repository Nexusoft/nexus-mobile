import React from 'react';
import styled from '@emotion/native';
import { Surface, TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';

const AccountWrapper = styled.View({
  marginVertical: 5,
});

const AccountInfo = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 15,
  paddingHorizontal: 20,
});

const AccountName = styled(Text)(({ theme }) => ({
  fontSize: 15,
  color: theme.dark ? theme.primary : theme.foreground,
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

const ButtonDivider = styled(Divider)({
  marginVertical: 10,
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
          <AccountBalance emphasis>{account.balance} NXS</AccountBalance>
        </AccountInfo>

        <AccountButtons>
          <AccountButton
            onPress={() => {
              navigate('Receive');
            }}
          >
            <AccountButtonLabel>RECEIVE</AccountButtonLabel>
          </AccountButton>

          <ButtonDivider vertical />

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

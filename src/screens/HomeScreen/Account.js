import React from 'react';
import styled from '@emotion/native';
import { Surface, TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import Divider from 'components/Divider';
import { navigate } from 'lib/navigation';

const AccountSurface = styled(Surface)({
  marginVertical: 15,
  marginHorizontal: 20,
  elevation: 3,
});

const AccountInfo = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingVertical: 15,
  paddingHorizontal: 20,
});

const AccountName = styled(Text)({
  fontSize: 15,
});

const AccountBalance = styled(Text)({
  fontSize: 15,
});

const AccountButtons = styled.View({
  flexDirection: 'row',
});

const AccountButton = styled(TouchableRipple)({
  flex: 1,
  alignItems: 'center',
  paddingVertical: 12,
});

const AccountButtonLabel = styled(Text)({
  fontSize: 12,
});

export default function Account({ account }) {
  return (
    <AccountSurface>
      <AccountInfo>
        <AccountName primary bold>
          {account.name}
        </AccountName>
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

        <Divider vertical style={{ marginVertical: 10 }} />

        <AccountButton
          onPress={() => {
            navigate('Send');
          }}
        >
          <AccountButtonLabel>SEND</AccountButtonLabel>
        </AccountButton>
      </AccountButtons>
    </AccountSurface>
  );
}

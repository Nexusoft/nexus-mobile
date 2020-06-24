import React from 'react';
import { FlatList } from 'react-native';
import styled from '@emotion/native';
import { TouchableRipple, FAB } from 'react-native-paper';

import { Divider, Text, DisabledText } from 'components/Adaptive';
import ScreenBody from 'components/ScreenBody';
import { navigate } from 'lib/navigation';
import { disabledColor } from 'lib/theme';
import segmentAddress from 'utils/segmentAddress';

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

const Wrapper = styled(ScreenBody)({
  paddingBottom: 106,
});

const Account = styled.View({
  paddingVertical: 20,
  paddingHorizontal: 30,
});

const AccountName = styled(Text)({
  fontSize: 16,
});

const NoName = styled(DisabledText)({
  fontSize: 16,
});

const AddressBox = styled.View(({ theme }) => ({
  borderWidth: 1,
  borderColor: disabledColor(theme.foreground),
  borderRadius: 4,
  paddingVertical: 5,
  paddingHorizontal: 8,
  marginTop: 12,
}));

const Address = styled(Text)({
  fontSize: 15,
  textAlign: 'center',
});

const AddButton = styled(FAB)({
  position: 'absolute',
  right: 30,
  bottom: 30,
});

export default function AccountsScreen() {
  return (
    <Wrapper scroll={false} surface>
      <FlatList
        data={accounts}
        ItemSeparatorComponent={Divider}
        keyExtractor={(acc) => acc.address}
        renderItem={({ item: account }) => (
          <TouchableRipple
            onPress={() => {
              navigate('AccountDetails', { account });
            }}
          >
            <Account>
              {account.name ? (
                <AccountName bold>{account.name}</AccountName>
              ) : (
                <NoName>No name</NoName>
              )}
              <AddressBox>
                <Address mono>{segmentAddress(account.address)}</Address>
              </AddressBox>
            </Account>
          </TouchableRipple>
        )}
      />
      <AddButton
        icon="plus"
        onPress={() => {
          navigate('NewAccount');
        }}
      />
    </Wrapper>
  );
}

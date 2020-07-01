import React from 'react';
import { Platform, Clipboard } from 'react-native';
import styled from '@emotion/native';
import moment from 'moment';
import { Button } from 'react-native-paper';

import { Surface, DisabledText } from 'components/Adaptive';
import Divider from 'components/Divider';
import ScreenBody from 'components/ScreenBody';
import SvgIcon from 'components/SvgIcon';
import InfoField from 'components/InfoField';
import { showNotification } from 'lib/ui';
import { navigate } from 'lib/navigation';
import segmentAddress from 'utils/segmentAddress';
import CopyIcon from 'icons/copy.svg';

const AccountSurface = styled(Surface)({
  elevation: 3,
  paddingHorizontal: 30,
  marginVertical: 15,
});

const Address = styled.Text({
  textAlign: 'center',
});

const Buttons = styled.View({
  flexDirection: 'row',
  paddingVertical: 8,
});

const AccountBtn = styled(Button)({
  flex: 1,
});

export default function AccountDetailsScreen({ route }) {
  const account = route.params?.account;
  return (
    <ScreenBody>
      <AccountSurface>
        <InfoField
          compact
          inline
          label="Account name"
          value={account.name || <DisabledText>No name</DisabledText>}
        />
        <Divider />
        <InfoField
          compact
          label="Account address"
          control={
            <Button
              mode="text"
              icon={(props) => <SvgIcon icon={CopyIcon} {...props} />}
              labelStyle={{ fontSize: 12 }}
              onPress={() => {
                Clipboard.setString(account.address);
                showNotification('Copied to clipboard');
              }}
            >
              Copy
            </Button>
          }
          value={<Address>{segmentAddress(account.address)}</Address>}
          mono
        />
        <Divider />
        <InfoField
          compact
          inline
          label="Created at"
          value={moment.unix(account.created).format('llll')}
        />
        <Divider />
        <InfoField
          compact
          inline
          label="Last modified"
          value={moment.unix(account.modified).format('llll')}
        />
        <Divider />
        <InfoField
          compact
          inline
          label="Token name"
          value={account.token_name}
        />
        <Divider />
        <InfoField
          compact
          inline
          label="Available balance"
          value={`${account.balance} ${account.token_name}`}
        />
        <Divider />
        <InfoField
          compact
          inline
          label="Pending balance"
          value={`${account.pending} ${account.token_name}`}
        />
        <Divider />
        <InfoField
          compact
          inline
          label="Unconfirmed balance"
          value={`${account.unconfirmed} ${account.token_name}`}
        />
        <Divider />
        {account.stake !== undefined && (
          <>
            <InfoField
              compact
              inline
              label="Stake balance"
              value={`${account.stake} ${account.token_name}`}
            />
            <Divider />
          </>
        )}
        {account.immature !== undefined && (
          <>
            <InfoField
              compact
              inline
              label="Immature balance"
              value={`${account.immature} ${account.token_name}`}
            />
            <Divider />
          </>
        )}

        <Buttons>
          {/* <AccountBtn mode="text">History</AccountBtn>
        <Divider vertical inset={10} /> */}
          <AccountBtn
            mode="text"
            onPress={() => {
              navigate('Receive', { account });
            }}
          >
            Receive
          </AccountBtn>
          <Divider vertical inset={10} />
          <AccountBtn
            mode="text"
            onPress={() => {
              navigate('Send');
            }}
          >
            Send
          </AccountBtn>
        </Buttons>
      </AccountSurface>
    </ScreenBody>
  );
}

AccountDetailsScreen.nav = {
  name: 'AccountDetails',
  options: {
    title: Platform.OS === 'ios' ? 'Account' : 'Account Details',
  },
};

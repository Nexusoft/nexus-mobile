import React from 'react';
import { Platform, Clipboard, View } from 'react-native';
import moment from 'moment';
import { Button, Surface } from 'react-native-paper';

import Text from 'components/Text';
import Divider from 'components/Divider';
import ScreenBody from 'components/ScreenBody';
import SvgIcon from 'components/SvgIcon';
import InfoField from 'components/InfoField';
import { showNotification } from 'lib/ui';
import { navigate } from 'lib/navigation';
import segmentAddress from 'utils/segmentAddress';
import CopyIcon from 'icons/copy.svg';

const styles = {
  account: {
    elevation: 3,
    paddingHorizontal: 30,
    marginVertical: 15,
  },
  address: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  action: {
    flex: 1,
  },
};

export default function AccountDetailsScreen({ route }) {
  const account = route.params?.account;
  return (
    <ScreenBody>
      <Surface style={styles.account}>
        <InfoField
          compact
          inline
          label="Account name"
          value={account.name || <Text disabled>No name</Text>}
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
          value={
            <Text mono style={styles.address}>
              {segmentAddress(account.address)}
            </Text>
          }
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
              label="Stake balance (locked)"
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

        <View style={styles.actions}>
          {/* <AccountBtn mode="text">History</AccountBtn>
        <Divider vertical inset={10} /> */}
          <Button
            style={styles.action}
            mode="text"
            onPress={() => {
              navigate('Receive', { account });
            }}
          >
            Receive
          </Button>
          <Divider vertical inset={10} />
          <Button
            style={styles.action}
            mode="text"
            onPress={() => {
              navigate('Send');
            }}
          >
            Send
          </Button>
        </View>
      </Surface>
    </ScreenBody>
  );
}

AccountDetailsScreen.nav = {
  name: 'AccountDetails',
  options: {
    title: Platform.OS === 'ios' ? 'Account' : 'Account Details',
  },
};

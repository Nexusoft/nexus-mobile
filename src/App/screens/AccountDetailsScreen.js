import React from 'react';
import { Platform, Clipboard, View, RefreshControl } from 'react-native';
import moment from 'moment';
import { Button, Surface } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import Divider from 'components/Divider';
import ScreenBody from 'components/ScreenBody';
import SvgIcon from 'components/SvgIcon';
import InfoField from 'components/InfoField';
import TokenName from 'components/TokenName';
import formatNumber from 'utils/formatNumber';
import { showNotification } from 'lib/ui';
import { navigate } from 'lib/navigation';
import { refreshUserAccount } from 'lib/user';
import segmentAddress from 'utils/segmentAddress';
import useRefresh from 'utils/useRefresh';
import { t } from 'lib/i18n';
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
  nameWrapper: {
    flexDirection: 'row',
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
  const address = route.params?.address;
  const account = useSelector((state) =>
    state.user.accounts?.find((acc) => acc.address === address)
  );
  const [refreshing, refresh] = useRefresh(() => refreshUserAccount(address));
  return (
    !!account && (
      <ScreenBody
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        <Surface style={styles.account}>
          <InfoField
            compact
            inline
            label={t('Account name')}
            value={
              account.name || (
                <Text disabled style={{ marginRight: 10 }}>
                  {t('Unnamed')}
                </Text>
              )
            }
          />
          <Divider />
          <InfoField
            compact
            label={t('Account address')}
            control={
              <Button
                mode="text"
                icon={(props) => <SvgIcon icon={CopyIcon} {...props} />}
                labelStyle={{ fontSize: 12 }}
                onPress={() => {
                  Clipboard.setString(account.address);
                  showNotification(t('Copied to clipboard'));
                }}
              >
                {t('Copy')}
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
            label={t('Created at')}
            value={moment.unix(account.created).format('llll')}
          />
          <Divider />
          <InfoField
            compact
            inline
            label={t('Last modified')}
            value={moment.unix(account.modified).format('llll')}
          />
          <Divider />
          <InfoField
            compact
            inline
            label={t('Token name')}
            value={
              account.ticker ||
              account.token_name || (
                <Text disabled style={{ marginRight: 10 }}>
                  {t('Unnamed')}
                </Text>
              )
            }
          />
          {!!account.token && account.token?.length === 51 && (
            <InfoField
              compact
              label={t('Token address')}
              value={
                <Text mono style={styles.address}>
                  {segmentAddress(account.token)}
                </Text>
              }
            />
          )}
          <Divider />
          {account.data !== undefined && (
            <>
              <InfoField
                compact
                label={t('Data')}
                value={<Text mono>{account.data}</Text>}
              />
              <Divider />
            </>
          )}
          <InfoField
            compact
            inline
            label={t('Available balance')}
            value={
              <Text>
                {formatNumber(account.balance || 0, { maximumFractionDigits: 6 })}{' '}
                <TokenName account={account} />
              </Text>
            }
          />
          <Divider />
          <InfoField
            compact
            inline
            label={t('Unclaimed balance')}
            value={
              <Text>
                {formatNumber(account.unclaimed || 0, { maximumFractionDigits: 6 })}{' '}
                <TokenName account={account} />
              </Text>
            }
          />
          <Divider />
          <InfoField
            compact
            inline
            label={t('Unconfirmed balance')}
            value={
              <Text>
                {formatNumber(account.unconfirmed || 0, { maximumFractionDigits: 6 })}{' '}
                <TokenName account={account} />
              </Text>
            }
          />
          <Divider />
          {account.stake !== undefined && (
            <>
              <InfoField
                compact
                inline
                label={t('Staking balance (locked)')}
                value={
                  <Text>
                    {formatNumber(account.stake || 0, { maximumFractionDigits: 6 })}{' '}
                <TokenName account={account} />
                  </Text>
                }
              />
              <Divider />
            </>
          )}
          {account.immature !== undefined && (
            <>
              <InfoField
                compact
                inline
                label={t('Immature balance')}
                value={
                  <Text>
                    {formatNumber(account.immature || 0, { maximumFractionDigits: 6 })}{' '}
                <TokenName account={account} />
                  </Text>
                }
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
              {t('Receive')}
            </Button>
            <Divider vertical inset={10} />
            {!account.name?.endsWith(':default') &&
              !account.name?.endsWith(':trust') && (
                <Button
                  style={styles.action}
                  mode="text"
                  onPress={() => {
                    navigate('RenameAccount', { account });
                  }}
                >
                  {t('Rename')}
                </Button>
              )}
            <Divider vertical inset={10} />
            <Button
              style={styles.action}
              mode="text"
              onPress={() => {
                navigate('Send', { account });
              }}
            >
              {t('Send')}
            </Button>
          </View>
        </Surface>
      </ScreenBody>
    )
  );
}

AccountDetailsScreen.nav = {
  name: 'AccountDetails',
  options: {
    title: Platform.OS === 'ios' ? 'Account' : 'Account Details',
  },
};

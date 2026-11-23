import React from 'react';
import { View, SectionList } from 'react-native';
import { TouchableRipple, FAB, Surface } from 'react-native-paper';
import { useTheme } from 'lib/theme';
import { useSelector } from 'react-redux';

import Text from 'components/Text';
import Divider from 'components/Divider';
import ScreenBody from 'components/ScreenBody';
import SvgIcon from 'components/SvgIcon';
import TokenName from 'components/TokenName';
import { CoinIcon } from 'components/CoinBadge';
import { navigate } from 'lib/navigation';
import { refreshUserAccounts } from 'lib/user';
import { accountRole, isNxs, sortAccounts } from 'lib/accounts';
import { disabledColor } from 'lib/theme';
import segmentAddress from 'utils/segmentAddress';
import formatNumber from 'utils/formatNumber';
import useRefresh from 'utils/useRefresh';
import WalletIcon from 'icons/wallet.svg';
import StakeIcon from 'icons/stake.svg';
import { t } from 'lib/i18n';

const styles = {
  wrapper: {
    paddingBottom: 106,
  },
  sectionHeader: ({ theme }) => ({
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: theme.dark ? theme.background : '#f3f6fa',
  }),
  sectionTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mainCard: ({ theme, accent }) => ({
    marginHorizontal: 14,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: accent,
    overflow: 'hidden',
  }),
  mainInner: {
    padding: 16,
  },
  mainTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundIcon: ({ background }) => ({
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  }),
  mainTitle: {
    flex: 1,
    minWidth: 0,
  },
  tag: ({ color }) => ({
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: color,
    marginLeft: 8,
  }),
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  explain: {
    marginTop: 10,
  },
  account: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  accBasic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accNameIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 10,
  },
  accIcon: {
    marginRight: 8,
  },
  accName: {
    fontSize: 16,
  },
  addressBox: ({ theme }) => ({
    borderWidth: 1,
    borderColor: disabledColor(theme.foreground),
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 12,
  }),
  address: {
    fontSize: 14,
    textAlign: 'center',
  },
  empty: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  add: {
    position: 'absolute',
    right: 30,
    bottom: 30,
  },
};

const roleLook = {
  default: {
    icon: WalletIcon,
    accent: '#0789c2',
    light: '#e3f5fe',
    dark: '#173445',
  },
  trust: {
    icon: StakeIcon,
    accent: '#1b9e5a',
    light: '#def5e8',
    dark: '#1f3d2e',
  },
};

function MainAccount({ account, role }) {
  const theme = useTheme();
  const look = roleLook[role];
  const staked = account.stake || 0;
  return (
    <Surface style={styles.mainCard({ theme, accent: look.accent })}>
      <TouchableRipple
        onPress={() => navigate('AccountDetails', { address: account.address })}
      >
        <View style={styles.mainInner}>
          <View style={styles.mainTop}>
            <View
              style={styles.roundIcon({
                background: theme.dark ? look.dark : look.light,
              })}
            >
              <SvgIcon icon={look.icon} size={20} color={look.accent} />
            </View>
            <View style={styles.mainTitle}>
              <Text bold size={16}>
                {role === 'trust' ? t('Trust account') : t('Default account')}
              </Text>
              <Text sub size={12} numberOfLines={1}>
                {account.name}
              </Text>
            </View>
            <View style={styles.tag({ color: look.accent })}>
              <Text size={11} bold color="#fff">
                {role === 'trust' ? t('Staking') : t('Main')}
              </Text>
            </View>
          </View>

          <View style={styles.balanceRow}>
            <CoinIcon size={18} style={{ marginRight: 6 }} />
            <Text size={20}>
              {formatNumber(account.balance || 0, { maximumFractionDigits: 6 })}{' '}
              <Text size={14} sub>
                NXS
              </Text>
            </Text>
          </View>
          {role === 'trust' && (
            <Text sub size={13} style={{ marginTop: 2 }}>
              {t('Staked: {amount} NXS', {
                amount: formatNumber(staked, { maximumFractionDigits: 6 }),
              })}
            </Text>
          )}

          <Text sub size={13} style={styles.explain}>
            {role === 'trust'
              ? t('Holds the NXS you stake. Send NXS here, then set your stake on the Staking page. Staked coins are locked until a stake block releases them.')
              : t('Your everyday NXS account. Receive and send from here unless you pick another account.')}
          </Text>

          <View style={styles.addressBox({ theme })}>
            <Text style={styles.address} mono>
              {segmentAddress(account.address)}
            </Text>
          </View>
        </View>
      </TouchableRipple>
    </Surface>
  );
}

function OtherAccount({ account }) {
  const theme = useTheme();
  const coin = isNxs(account);
  return (
    <TouchableRipple
      onPress={() => navigate('AccountDetails', { address: account.address })}
    >
      <View style={styles.account}>
        <View style={styles.accBasic}>
          <View style={styles.accNameIcon}>
            <CoinIcon coin={coin} size={16} style={styles.accIcon} />
            <Text style={styles.accName} bold disabled={!account.name}>
              {account.name || t('Unnamed')}
            </Text>
          </View>
          <Text>
            {formatNumber(account.balance || 0)}{' '}
            <TokenName bold disabled account={account} />
          </Text>
        </View>
        <View style={styles.addressBox({ theme })}>
          <Text style={styles.address} mono>
            {segmentAddress(account.address)}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );
}

export default function AccountsScreen() {
  const theme = useTheme();
  const accounts = useSelector((state) => state.user.accounts);
  const [refreshing, refresh] = useRefresh(refreshUserAccounts);
  const sorted = sortAccounts(accounts) || [];
  const main = sorted.filter((a) => accountRole(a));
  const others = sorted.filter((a) => !accountRole(a));
  const sections = [
    ...(main.length
      ? [
          {
            key: 'main',
            title: t('Main accounts'),
            note: t('Made with your profile. They cannot be renamed, and accounts on Nexus cannot be deleted.'),
            data: main,
          },
        ]
      : []),
    {
      key: 'others',
      title: t('Your accounts'),
      data: others,
    },
  ];
  return (
    <ScreenBody scroll={false} surface style={styles.wrapper}>
      {accounts && (
        <SectionList
          refreshing={refreshing}
          onRefresh={refresh}
          sections={sections}
          stickySectionHeadersEnabled={false}
          keyExtractor={(acc) => acc.address}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader({ theme })}>
              <Text sub bold style={styles.sectionTitle}>
                {section.title}
              </Text>
              {!!section.note && (
                <Text sub size={12} style={{ marginTop: 2 }}>
                  {section.note}
                </Text>
              )}
            </View>
          )}
          renderSectionFooter={({ section }) =>
            section.key === 'others' && !section.data.length ? (
              <View style={styles.empty}>
                <Text sub size={13}>
                  {t('Accounts you create show here. Tap + to make one, for example to keep savings apart or to hold a token.')}
                </Text>
              </View>
            ) : null
          }
          ItemSeparatorComponent={({ section }) =>
            section.key === 'others' ? <Divider /> : null
          }
          renderItem={({ item: account }) => {
            const role = accountRole(account);
            return role ? (
              <MainAccount account={account} role={role} />
            ) : (
              <OtherAccount account={account} />
            );
          }}
        />
      )}
      <FAB
        style={styles.add}
        icon="plus"
        onPress={() => {
          navigate('NewAccount');
        }}
      />
    </ScreenBody>
  );
}

AccountsScreen.nav = {
  name: 'Accounts',
};

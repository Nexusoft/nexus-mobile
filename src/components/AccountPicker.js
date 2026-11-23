import React from 'react';
import { View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import TokenName from 'components/TokenName';
import { CoinIcon } from 'components/CoinBadge';
import { showOptions } from 'lib/ui';
import { useTheme } from 'lib/theme';
import { t } from 'lib/i18n';
import { accountRole, isNxs, sortAccounts } from 'lib/accounts';
import { getStore } from 'store';
import formatNumber from 'utils/formatNumber';
import WalletIcon from 'icons/wallet.svg';
import StakeIcon from 'icons/stake.svg';
import ChevronDownIcon from 'icons/chevron-down.svg';

const styles = {
  option: ({ selected, theme }) => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: selected
      ? theme.dark
        ? 'rgba(255,255,255,0.06)'
        : '#e3f5fe'
      : undefined,
  }),
  name: {
    flex: 1,
    minWidth: 0,
    marginLeft: 10,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    paddingVertical: 4,
  },
};

export function AccountIcon({ account, size = 16, color }) {
  const role = accountRole(account);
  if (role) {
    return (
      <SvgIcon
        icon={role === 'trust' ? StakeIcon : WalletIcon}
        size={size}
        color={color || (role === 'trust' ? '#1b9e5a' : undefined)}
        colorName="primary"
      />
    );
  }
  return <CoinIcon coin={isNxs(account)} size={size} color={color} />;
}

function Option({ account, selected }) {
  const theme = useTheme();
  const role = accountRole(account);
  return (
    <View style={styles.option({ selected, theme })}>
      <AccountIcon account={account} size={18} />
      <View style={styles.name}>
        <Text bold numberOfLines={1}>
          {account.name || t('Unnamed')}
        </Text>
        {!!role && (
          <Text sub size={12}>
            {role === 'trust' ? t('Trust account') : t('Default account')}
          </Text>
        )}
      </View>
      <Text>
        {formatNumber(account.balance || 0, { maximumFractionDigits: 6 })}{' '}
        <TokenName sub account={account} />
      </Text>
    </View>
  );
}

//dialog with the user's accounts, main ones first
export function pickAccount({ title, current, filter, onSelect }) {
  const accounts = sortAccounts(
    (getStore().getState().user.accounts || []).filter(filter || (() => true))
  );
  showOptions({
    title,
    options: accounts,
    keyExtractor: (account) => account.address,
    renderOption: (account) => (
      <Option account={account} selected={account.address === current?.address} />
    ),
    onSelect,
  });
}

//"<icon> name  v" that opens the picker
export default function AccountPicker({
  account,
  title,
  filter,
  onChange,
  color,
  style,
}) {
  return (
    <TouchableRipple
      borderless
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={() => pickAccount({ title, current: account, filter, onSelect: onChange })}
      style={[{ borderRadius: 6 }, style]}
    >
      <View style={styles.trigger}>
        {!!account && <AccountIcon account={account} size={16} color={color} />}
        <Text
          bold
          size={16}
          color={color}
          numberOfLines={1}
          style={{ flexShrink: 1, marginLeft: 8 }}
        >
          {account ? account.name || t('Unnamed') : t('Choose an account')}
        </Text>
        <SvgIcon
          icon={ChevronDownIcon}
          size={12}
          color={color}
          style={{ marginLeft: 8 }}
        />
        <Text size={12} color={color} style={{ marginLeft: 'auto', opacity: 0.8 }}>
          {t('Change')}
        </Text>
      </View>
    </TouchableRipple>
  );
}

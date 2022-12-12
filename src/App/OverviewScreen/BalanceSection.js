import React from 'react';
import { LayoutAnimation, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import { useTheme, subColor } from 'lib/theme';
import { refreshUserBalances } from 'lib/user';
import { refreshMarketPrice } from 'lib/market';
import { selectSetting } from 'lib/settings';
import { getStore } from 'store';
import formatNumber from 'utils/formatNumber';
import memoize from 'utils/memoize';
import UpArrowIcon from 'icons/chevron-up.svg';
import DownArrowIcon from 'icons/chevron-down.svg';

const styles = {
  wrapper: {
    minHeight: '30%',
    paddingVertical: 25,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  brief: {
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  balance: {
    fontSize: 34,
    textAlign: 'center',
    marginBottom: 10,
  },
  fiatValue: {
    fontSize: 18,
  },
  expandIcon: ({ theme }) => ({
    position: 'absolute',
    top: 4,
    right: 10,
    alignSelf: 'flex-end',
    color: subColor(theme.dark ? theme.foreground : theme.onPrimary),
  }),
  subBalances: ({ expanded }) => ({
    // setting height to 0 makes text have the stretch effect
    // setting height to > 0 makes text have the revealing effect (on Android)
    height: expanded ? undefined : 0.01,
    overflow: 'hidden',
    alignSelf: 'stretch',
    paddingTop: expanded ? 20 : 0,
    paddingHorizontal: '10%',
  }),
  subBalance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
};

const selectBalances = memoize(
  (balances) => {
    if (!balances) return [undefined, undefined];
    const nxsIndex = balances.findIndex(({ token }) => token === '0');
    const tokenBalances = [...balances];
    const [nxsBalances] = tokenBalances.splice(nxsIndex, 1);
    return [nxsBalances, tokenBalances];
  },
  ({ user: { balances } }) => [balances]
);

function BalanceText(props) {
  const theme = useTheme();
  return (
    <Text colorName={theme.dark ? 'foreground' : 'onPrimary'} {...props} />
  );
}

export default function BalanceSection({ filteredAccounts }) {
  const theme = useTheme();
  const [userExpanded, setUserExpanded] = React.useState(null);
  const expanded =
    filteredAccounts?.length === 1 && userExpanded === null
      ? true
      : !!userExpanded;
  const [nxsBalances] = useSelector(selectBalances);
  const baseCurrency = useSelector(selectSetting('baseCurrency'));
  const hideBalances = useSelector(selectSetting('hideBalances'));
  const price = useSelector(({ market: { price } }) => price);
  const { available, unclaimed, unconfirmed, stake, immature } =
    nxsBalances || {};
  React.useEffect(() => {
    refreshMarketPrice();
  }, []);
  useFocusEffect(
    React.useCallback(() => {
      const store = getStore();
      const unobserve = store.observe(
        (state) => state.user.status,
        (userStatus) => {
          if (userStatus) refreshUserBalances();
        }
      );

      return unobserve;
    }, [])
  );
  const renderBalance = (amount, formatOptions, currency = 'NXS') => {
    if (hideBalances) return '??? ' + currency;
    if (!nxsBalances) return 'N/A';
    // VND doesn't have decimal digits
    if (currency === 'VND') {
      formatOptions.maximumFractionDigits = 0;
    }
    return formatNumber(amount, formatOptions) + ' ' + currency;
  };

  return (
    <TouchableRipple
      style={styles.wrapper}
      onPress={() => {
        LayoutAnimation.easeInEaseOut();
        setUserExpanded(!expanded);
      }}
    >
      <>
        <View style={styles.brief}>
          <BalanceText style={styles.balanceLabel}>Balance</BalanceText>
          <BalanceText style={styles.balance}>
            {renderBalance(available + stake, { maximumFractionDigits: 2 })}
          </BalanceText>
          {!!price && !!nxsBalances && (
            <BalanceText style={styles.fiatValue} sub>
              ≈ 
              {renderBalance(
                (available + stake) * price,
                {
                  maximumFractionDigits: 2,
                },
                baseCurrency
              )}
            </BalanceText>
          )}
          <SvgIcon
            size={10}
            style={styles.expandIcon({ theme })}
            icon={expanded ? UpArrowIcon : DownArrowIcon}
          />
        </View>

        <View style={styles.subBalances({ expanded })}>
          <View style={styles.subBalance}>
            <BalanceText>Available</BalanceText>
            <BalanceText>{renderBalance(available)}</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Staking (locked)</BalanceText>
            <BalanceText>{renderBalance(stake)}</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Unclaimed</BalanceText>
            <BalanceText>{renderBalance(unclaimed)}</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Unconfirmed</BalanceText>
            <BalanceText>{renderBalance(unconfirmed)}</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Immature</BalanceText>
            <BalanceText>{renderBalance(immature)}</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Total</BalanceText>
            <BalanceText>
              {renderBalance(
                available + stake + unclaimed + unconfirmed + immature
              )}
            </BalanceText>
          </View>
        </View>
      </>
    </TouchableRipple>
  );
}

import React from 'react';
import { LayoutAnimation, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import Text from 'components/Text';
import { useTheme, subColor } from 'lib/theme';
import { refreshUserBalances } from 'lib/user';
import { refreshMarketPrice } from 'lib/market';
import { selectSetting } from 'lib/settings';
import { getStore } from 'store';
import formatNumber from 'utils/formatNumber';

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
    fontSize: 15,
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

function BalanceText(props) {
  const theme = useTheme();
  return (
    <Text colorName={theme.dark ? 'foreground' : 'onPrimary'} {...props} />
  );
}

export default function BalanceSection() {
  const theme = useTheme();
  const [expanded, setExpanded] = React.useState(false);
  const balances = useSelector((state) => state.user?.balances);
  const baseCurrency = useSelector(selectSetting('baseCurrency'));
  const price = useSelector(({ market: { price } }) => price);
  const { available, pending, unconfirmed, stake, immature } = balances || {};
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

  return (
    <TouchableRipple
      style={styles.wrapper}
      onPress={() => {
        LayoutAnimation.easeInEaseOut();
        setExpanded(!expanded);
      }}
    >
      <>
        <View style={styles.brief}>
          <BalanceText style={styles.balanceLabel}>Balance</BalanceText>
          <BalanceText style={styles.balance}>
            {balances
              ? formatNumber(available + stake, { maximumFractionDigits: 2 }) +
                ' NXS'
              : 'N/A'}
          </BalanceText>
          {!!price && (
            <BalanceText style={styles.fiatValue} sub>
              ≈ 
              {formatNumber((available + stake) * price, {
                maximumFractionDigits: 2,
              })}{' '}
              {baseCurrency}
            </BalanceText>
          )}
          <Ionicons
            style={styles.expandIcon({ theme })}
            name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'}
          />
        </View>

        <View style={styles.subBalances({ expanded })}>
          <View style={styles.subBalance}>
            <BalanceText>Available</BalanceText>
            <BalanceText>
              {balances ? formatNumber(available) + ' NXS' : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Staking (locked)</BalanceText>
            <BalanceText>
              {balances ? formatNumber(stake) + ' NXS' : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Pending</BalanceText>
            <BalanceText>
              {balances ? formatNumber(pending) + ' NXS' : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Unconfirmed</BalanceText>
            <BalanceText>
              {balances ? formatNumber(unconfirmed) + ' NXS' : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Immature</BalanceText>
            <BalanceText>
              {balances ? formatNumber(immature) + ' NXS' : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Total</BalanceText>
            <BalanceText>
              {balances
                ? formatNumber(
                    available + stake + pending + unconfirmed + immature
                  ) + ' NXS'
                : 'N/A'}
            </BalanceText>
          </View>
        </View>
      </>
    </TouchableRipple>
  );
}

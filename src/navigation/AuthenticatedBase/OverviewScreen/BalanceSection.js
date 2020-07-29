import React from 'react';
import { LayoutAnimation, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useSelector } from 'react-redux';

import { getStore } from 'store';
import Text from 'components/Text';
import { useTheme, subColor } from 'lib/theme';
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
    marginTop: 5,
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
    // setting height to > 0 makes text have the revealing effect
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
  const { available, pending, unconfirmed, stake, immature } = balances || {};

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
            {balances ? formatNumber(available + stake) + ' NXS' : 'N/A'}
          </BalanceText>
          {/* <BalanceText style={styles.fiatValue} sub>
            ≈1,931.32 USD
          </BalanceText> */}
          <Ionicons
            style={styles.expandIcon({ theme })}
            name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'}
          />
        </View>

        <View style={styles.subBalances({ expanded })}>
          <View style={styles.subBalance}>
            <BalanceText>Available</BalanceText>
            <BalanceText>
              {balances
                ? formatNumber(available, { maximumFractionDigits: 6 }) + ' NXS'
                : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Stake (locked)</BalanceText>
            <BalanceText>
              {balances
                ? formatNumber(stake, { maximumFractionDigits: 6 }) + ' NXS'
                : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Pending</BalanceText>
            <BalanceText>
              {balances
                ? formatNumber(pending, { maximumFractionDigits: 6 }) + ' NXS'
                : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Unconfirmed</BalanceText>
            <BalanceText>
              {balances
                ? formatNumber(unconfirmed, { maximumFractionDigits: 6 }) +
                  'NXS'
                : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Immature</BalanceText>
            <BalanceText>
              {balances
                ? formatNumber(immature, { maximumFractionDigits: 6 }) + ' NXS'
                : 'N/A'}
            </BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Total</BalanceText>
            <BalanceText>
              {balances
                ? formatNumber(
                    available + stake + pending + unconfirmed + immature,
                    { maximumFractionDigits: 6 }
                  ) + ' NXS'
                : 'N/A'}
            </BalanceText>
          </View>
        </View>
      </>
    </TouchableRipple>
  );
}

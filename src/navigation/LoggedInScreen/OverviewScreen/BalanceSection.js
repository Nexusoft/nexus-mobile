import React from 'react';
import { LayoutAnimation, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import { useTheme } from 'lib/theme';

import Text from 'components/Text';
import { subColor } from 'lib/theme';

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
    paddingTop: expanded ? 30 : 0,
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
          <BalanceText style={styles.balance}>10,435.643 NXS</BalanceText>
          <BalanceText style={styles.fiatValue} sub>
            ≈ 1,931.32 USD
          </BalanceText>
          <Ionicons
            style={styles.expandIcon({ theme })}
            name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'}
          />
        </View>

        <View style={styles.subBalances({ expanded })}>
          <View style={styles.subBalance}>
            <BalanceText>Available</BalanceText>
            <BalanceText>24,464.345474 NXS</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Stake (locked)</BalanceText>
            <BalanceText>35,378.343457 NXS</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Pending</BalanceText>
            <BalanceText>0 NXS</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Unconfirmed</BalanceText>
            <BalanceText>0 NXS</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Immature</BalanceText>
            <BalanceText>0 NXS</BalanceText>
          </View>
          <View style={styles.subBalance}>
            <BalanceText>Total</BalanceText>
            <BalanceText>64,324.565803 NXS</BalanceText>
          </View>
        </View>
      </>
    </TouchableRipple>
  );
}

import React from 'react';
import { LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import styled from '@emotion/native';

import Text from 'components/Text';
import { subColor } from 'lib/theme';

const Wrapper = styled(TouchableRipple)({
  minHeight: '30%',
  paddingVertical: 25,
  paddingHorizontal: 20,
  justifyContent: 'center',
});

const BalanceBrief = styled.View({
  alignItems: 'center',
  // paddingBottom: 20,
});

const BalanceText = styled(Text)(({ theme }) => ({
  color: theme.dark ? theme.foreground : theme.onPrimary,
}));

const BalanceLabel = styled(BalanceText)({
  fontSize: 12,
  textTransform: 'uppercase',
});

const Balance = styled(BalanceText)({
  fontSize: 34,
});

const Value = styled(BalanceText)({
  marginTop: 5,
  fontSize: 18,
});

const ExpandIcon = styled(Ionicons)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 10,
  fontSize: 15,
  alignSelf: 'flex-end',
  color: subColor(theme.dark ? theme.foreground : theme.onPrimary),
}));

const DetailedBalances = styled.View(({ expanded }) => ({
  // setting height to 0 makes text have the stretch effect
  // setting height to > 0 makes text have the revealing effect
  height: expanded ? undefined : 0.01,
  overflow: 'hidden',
  alignSelf: 'stretch',
  paddingTop: expanded ? 30 : 0,
  paddingHorizontal: '10%',
}));

const DetailedBalance = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginVertical: 4,
});

export default function BalanceSection() {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Wrapper
      onPress={() => {
        LayoutAnimation.easeInEaseOut();
        setExpanded(!expanded);
      }}
    >
      <>
        <BalanceBrief>
          <BalanceLabel>Balance</BalanceLabel>
          <Balance>10,435.643 NXS</Balance>
          <Value sub>≈ 1,931.32 USD</Value>
          <ExpandIcon name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'} />
        </BalanceBrief>

        <DetailedBalances expanded={expanded}>
          <DetailedBalance>
            <BalanceText>Available</BalanceText>
            <BalanceText>24,464.345474 NXS</BalanceText>
          </DetailedBalance>
          <DetailedBalance>
            <BalanceText>Stake (locked)</BalanceText>
            <BalanceText>35,378.343457 NXS</BalanceText>
          </DetailedBalance>
          <DetailedBalance>
            <BalanceText>Pending</BalanceText>
            <BalanceText>0 NXS</BalanceText>
          </DetailedBalance>
          <DetailedBalance>
            <BalanceText>Unconfirmed</BalanceText>
            <BalanceText>0 NXS</BalanceText>
          </DetailedBalance>
          <DetailedBalance>
            <BalanceText>Immature</BalanceText>
            <BalanceText>0 NXS</BalanceText>
          </DetailedBalance>
          <DetailedBalance>
            <BalanceText>Total</BalanceText>
            <BalanceText>64,324.565803 NXS</BalanceText>
          </DetailedBalance>
        </DetailedBalances>
      </>
    </Wrapper>
  );
}

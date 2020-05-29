import React from 'react';
import { LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import styled from '@emotion/native';

import Text from 'components/Text';
import { subColor } from 'utils/color';

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

const BalanceLabel = styled(Text)(({ theme }) => ({
  fontSize: 12,
  textTransform: 'uppercase',
  color: theme.dark ? theme.foreground : theme.onPrimary,
}));

const Balance = styled(Text)(({ theme }) => ({
  fontSize: 34,
  color: theme.dark ? theme.foreground : theme.onPrimary,
}));

const Value = styled(Text)(({ theme }) => ({
  marginTop: 5,
  fontSize: 18,
  color: theme.subColor(theme.dark ? theme.foreground : theme.onPrimary),
}));

const ExpandIcon = styled(Ionicons)(({ theme }) => ({
  position: 'absolute',
  top: 4,
  right: 10,
  color: subColor(theme.dark ? theme.foreground : theme.onPrimary),
  fontSize: 15,
  alignSelf: 'flex-end',
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

const DetailedText = styled(Text)(({ theme }) => ({
  color: theme.dark ? theme.foreground : theme.onPrimary,
}));

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
          <Value>≈ 1,931.32 USD</Value>
          <ExpandIcon name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'} />
        </BalanceBrief>

        <DetailedBalances expanded={expanded}>
          <DetailedBalance>
            <DetailedText>Available</DetailedText>
            <DetailedText>24,464.345474 NXS</DetailedText>
          </DetailedBalance>
          <DetailedBalance>
            <DetailedText>Stake</DetailedText>
            <DetailedText>35,378.343457 NXS</DetailedText>
          </DetailedBalance>
          <DetailedBalance>
            <DetailedText>Pending</DetailedText>
            <DetailedText>0 NXS</DetailedText>
          </DetailedBalance>
          <DetailedBalance>
            <DetailedText>Unconfirmed</DetailedText>
            <DetailedText>0 NXS</DetailedText>
          </DetailedBalance>
          <DetailedBalance>
            <DetailedText>Immature</DetailedText>
            <DetailedText>0 NXS</DetailedText>
          </DetailedBalance>
          <DetailedBalance>
            <DetailedText>Total</DetailedText>
            <DetailedText>64,324.565803 NXS</DetailedText>
          </DetailedBalance>
        </DetailedBalances>
      </>
    </Wrapper>
  );
}

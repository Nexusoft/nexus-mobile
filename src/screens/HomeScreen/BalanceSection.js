import React from 'react';
import { LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import styled from '@emotion/native';

import { Text } from 'components/StyledText';

const Wrapper = styled.View({
  paddingVertical: 20,
  paddingHorizontal: 20,
  alignItems: 'center',
});

const BalanceLabel = styled(Text)({
  fontSize: 12,
  textTransform: 'uppercase',
});

const Balance = styled(Text)({
  fontSize: 30,
});

const Value = styled(Text)({
  marginTop: 5,
  fontSize: 17,
});

const ExpandIcon = styled(Ionicons)(({ theme }) => ({
  position: 'absolute',
  top: 23,
  right: 30,
  color: theme.foreground,
  fontSize: 15,
  alignSelf: 'flex-end',
}));

const DetailedBalances = styled.View(({ expanded }) => ({
  height: expanded ? undefined : 0,
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
    <TouchableRipple
      onPress={() => {
        LayoutAnimation.easeInEaseOut();
        setExpanded(!expanded);
      }}
    >
      <Wrapper>
        <BalanceLabel emphasis>Balance</BalanceLabel>
        <Balance emphasis>10,435.643 NXS</Balance>
        <Value>≈ 1,931.32 USD</Value>
        <ExpandIcon name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'} />

        <DetailedBalances expanded={expanded}>
          <DetailedBalance>
            <Text>Available</Text>
            <Text>24,464.345474 NXS</Text>
          </DetailedBalance>
          <DetailedBalance>
            <Text>Stake</Text>
            <Text>35,378.343457 NXS</Text>
          </DetailedBalance>
          <DetailedBalance>
            <Text>Pending</Text>
            <Text>0 NXS</Text>
          </DetailedBalance>
          <DetailedBalance>
            <Text>Unconfirmed</Text>
            <Text>0 NXS</Text>
          </DetailedBalance>
          <DetailedBalance>
            <Text>Immature</Text>
            <Text>0 NXS</Text>
          </DetailedBalance>
          <DetailedBalance>
            <Text>Total</Text>
            <Text>64,324.565803 NXS</Text>
          </DetailedBalance>
        </DetailedBalances>
      </Wrapper>
    </TouchableRipple>
  );
}

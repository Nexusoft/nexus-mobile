import React from 'react';
import { LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableRipple } from 'react-native-paper';
import styled from '@emotion/native';

import { Text, SubText } from 'components/Adaptive';
import { adaptive } from 'lib/adaptive';

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

const BalanceLabel = styled(Text)({
  fontSize: 12,
  textTransform: 'uppercase',
});

const Balance = styled(Text)({
  fontSize: 34,
});

const Value = styled(SubText)({
  marginTop: 5,
  fontSize: 18,
});

const ExpandIcon = styled(
  adaptive({ modifier: 'sub', colorProp: true })(Ionicons)
)({
  position: 'absolute',
  top: 4,
  right: 10,
  fontSize: 15,
  alignSelf: 'flex-end',
});

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
          <Value>≈ 1,931.32 USD</Value>
          <ExpandIcon name={expanded ? 'ios-arrow-up' : 'ios-arrow-down'} />
        </BalanceBrief>

        <DetailedBalances expanded={expanded}>
          <DetailedBalance>
            <Text>Available</Text>
            <Text>24,464.345474 NXS</Text>
          </DetailedBalance>
          <DetailedBalance>
            <Text>Stake (locked)</Text>
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
      </>
    </Wrapper>
  );
}

import React from 'react';
import { LayoutAnimation } from 'react-native';
import { Surface, TouchableRipple } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import styled from '@emotion/native';
import QRCode from 'react-native-qrcode-svg';

import Text from 'components/Text';
import { showNotification } from 'lib/notifications';
import segmentAddress from 'utils/segmentAddress';
import CopyIcon from 'icons/copy.svg';

const accounts = [
  {
    name: 'default',
    address: '8BJhfDBEhs73RYmUeM6YRvamRHWP6zjoaSjPRkGbxsFAuiXTuGW',
    token_name: 'NXS',
    balance: 0,
  },
  {
    name: 'trust',
    address: '8Gbwm4sH9VttWNLpyuXe4zjH1wf5UFxkjjnuGjihPqsdodVBcwk',
    token_name: 'NXS',
    balance: 40355.236479,
  },
];

const Wrapper = styled(ScrollView)({
  flex: 1,
  paddingVertical: 20,
});

const AccountWrapper = styled(Surface)(({ active }) => ({
  marginVertical: 15,
  marginHorizontal: 20,
  elevation: active ? 3 : 2,
  borderRadius: 4,
}));

const AccountHeader = styled.View(({ theme, active }) => ({
  backgroundColor: active && !theme.dark ? theme.primary : 'rgba(0,0,0,0)',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 15,
  paddingHorizontal: 15,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
}));

const AccountName = styled(Text)(({ theme, active }) => ({
  color: active && !theme.dark ? theme.primaryAccent : theme.foregroundEmphasis,
}));

const AccountBalance = styled(Text)(({ theme, active }) => ({
  color: active && !theme.dark ? theme.primaryAccent : theme.foregroundEmphasis,
}));

const AccountDetails = styled.View(({ expanded }) => ({
  height: expanded ? undefined : 0,
  overflow: 'hidden',
  paddingVertical: expanded ? 20 : 0,
  alignItems: 'center',
  justifyContent: 'center',
}));

const AccountAddressLabel = styled(Text)({
  marginTop: 15,
});

const AccountAddress = styled(Text)({
  marginTop: 15,
});

const Copy = styled(CopyIcon)(({ theme }) => ({
  color: theme.foreground,
  width: 14,
  height: 14,
}));

const Account = ({ account, active, activate }) => (
  <AccountWrapper active={active}>
    <TouchableRipple onPress={active ? undefined : activate}>
      <AccountHeader active={active}>
        <AccountName bold active={active}>
          {account.name}
        </AccountName>
        <AccountBalance active={active}>
          {account.balance} {account.token_name}
        </AccountBalance>
      </AccountHeader>
    </TouchableRipple>

    <TouchableRipple
      onPress={() => {
        showNotification('Copied to clipboard');
      }}
    >
      <AccountDetails expanded={active}>
        <QRCode value={account.address} size={200} />
        <AccountAddress mono emphasis>
          {segmentAddress(account.address)}
        </AccountAddress>
        <AccountAddressLabel>
          <Copy /> Touch to copy account address
        </AccountAddressLabel>
      </AccountDetails>
    </TouchableRipple>
  </AccountWrapper>
);

export default function ReceiveScreen() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  return (
    <Wrapper>
      {accounts.map((account, i) => (
        <Account
          key={i}
          account={account}
          active={activeIndex === i}
          activate={() => {
            LayoutAnimation.easeInEaseOut();
            setActiveIndex(i);
          }}
        />
      ))}
    </Wrapper>
  );
}

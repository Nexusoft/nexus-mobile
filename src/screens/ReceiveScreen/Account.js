import React from 'react';
import { Clipboard } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import styled from '@emotion/native';
import QRCode from 'react-native-qrcode-svg';

import { Surface, View, Text, SubText, Icon } from 'components/Typo';
import { showNotification } from 'lib/notifications';
import segmentAddress from 'utils/segmentAddress';
import CopyIcon from 'icons/copy.svg';

const AccountWrapper = styled(Surface)(({ active }) => ({
  marginVertical: 15,
  marginHorizontal: 20,
  elevation: active ? 3 : 2,
  borderRadius: 4,
}));

const AccountHeader = styled(View)(({ theme, active }) => ({
  backgroundColor: active && !theme.dark ? theme.primary : undefined,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 15,
  paddingHorizontal: 15,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
}));

const AccountDetails = styled.View(({ expanded }) => ({
  height: expanded ? undefined : 0,
  overflow: 'hidden',
  paddingVertical: expanded ? 20 : 0,
  alignItems: 'center',
  justifyContent: 'center',
}));

const AccountAddressLabel = styled(SubText)({
  marginTop: 15,
});

const AccountAddress = styled(Text)({
  marginTop: 15,
});

export default function Account({ account, active, activate }) {
  return (
    <AccountWrapper active={active}>
      <TouchableRipple onPress={active ? undefined : activate}>
        <AccountHeader active={active}>
          <Text bold>{account.name}</Text>
          <Text>
            {account.balance} {account.token_name}
          </Text>
        </AccountHeader>
      </TouchableRipple>

      <TouchableRipple
        onPress={() => {
          Clipboard.setString(account.address);
          showNotification('Copied to clipboard');
        }}
      >
        <AccountDetails expanded={active}>
          <QRCode value={account.address} size={200} />
          <AccountAddress mono>
            {segmentAddress(account.address)}
          </AccountAddress>
          <AccountAddressLabel>
            <Icon icon={CopyIcon} size={14} /> Touch to copy account address
          </AccountAddressLabel>
        </AccountDetails>
      </TouchableRipple>
    </AccountWrapper>
  );
}

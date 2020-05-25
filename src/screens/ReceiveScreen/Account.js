import React from 'react';
import { Clipboard } from 'react-native';
import { Surface, TouchableRipple } from 'react-native-paper';
import styled from '@emotion/native';
import QRCode from 'react-native-qrcode-svg';

import Text from 'components/Text';
import SvgIcon from 'components/SvgIcon';
import { showNotification } from 'lib/notifications';
import segmentAddress from 'utils/segmentAddress';
import CopyIcon from 'icons/copy.svg';

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
  color: active && !theme.dark ? theme.onPrimary : theme.foreground,
}));

const AccountBalance = styled(Text)(({ theme, active }) => ({
  color: active && !theme.dark ? theme.onPrimary : theme.foreground,
}));

const AccountDetails = styled.View(({ expanded }) => ({
  height: expanded ? undefined : 0,
  overflow: 'hidden',
  paddingVertical: expanded ? 20 : 0,
  alignItems: 'center',
  justifyContent: 'center',
}));

const AccountAddressLabel = styled(Text.template({ modifier: 'sub' }))({
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
          Clipboard.setString(account.address);
          showNotification('Copied to clipboard');
        }}
      >
        <AccountDetails expanded={active}>
          <QRCode value={account.address} size={200} />
          <AccountAddress mono emphasis>
            {segmentAddress(account.address)}
          </AccountAddress>
          <AccountAddressLabel>
            <SvgIcon icon={CopyIcon} size={14} /> Touch to copy account address
          </AccountAddressLabel>
        </AccountDetails>
      </TouchableRipple>
    </AccountWrapper>
  );
}

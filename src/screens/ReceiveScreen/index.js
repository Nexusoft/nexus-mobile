import React from 'react';
import { Clipboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import styled from '@emotion/native';
import { useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';

import {
  Surface,
  View,
  Divider,
  Text,
  SubText,
  DisabledText,
  Icon,
} from 'components/Typo';
import { showNotification } from 'lib/notifications';
import segmentAddress from 'utils/segmentAddress';
import CopyIcon from 'icons/copy.svg';

const Wrapper = styled(ScrollView)(({ theme }) => ({
  backgroundColor: theme.dark ? theme.background : theme.primary,
  flex: 1,
  paddingHorizontal: 20,
}));

const TopInstruction = styled.View({
  marginBottom: 30,
  alignItems: 'center',
});

const AddressInfo = styled.View({
  // flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
});

const Title = styled(Text)({
  fontSize: 20,
  marginBottom: 30,
});

const Main = styled(Surface)({
  paddingVertical: 30,
  paddingHorizontal: 30,
  alignItems: 'center',
  borderRadius: 20,
});

const AccountAddressLabel = styled(SubText)({
  marginTop: 15,
});

const AccountAddress = styled(Text)({
  marginTop: 30,
});

const Separator = styled.View({
  marginVertical: 30,
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'stretch',
  // width: '100%',
});

const SeparatorLine = styled(Divider)({
  flex: 1,
  top: 2,
});

const SeparatorLabel = styled(DisabledText)({
  paddingHorizontal: 15,
});

const BottomInstruction = styled.View({
  // flex: 2,
  alignItems: 'center',
  justifyContent: 'center',
});

export default function ReceiveScreen() {
  const route = useRoute();
  const accountName = route.params?.accountName;
  const address = route.params?.address;
  return (
    <Wrapper
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        paddingTop: 20,
        paddingBottom: 80,
      }}
    >
      <Main>
        <TopInstruction>
          <SubText>Show this QR code to the sender</SubText>
        </TopInstruction>
        <QRCode value={address} size={200} />
        <AccountAddress mono>{segmentAddress(address)}</AccountAddress>
        <Separator>
          <SeparatorLine />
          <SeparatorLabel>or</SeparatorLabel>
          <SeparatorLine />
        </Separator>
        <Button
          style={{ alignSelf: 'stretch' }}
          mode="outlined"
          uppercase={false}
          icon={({ size }) => <Icon icon={CopyIcon} size={size} />}
          onPress={() => {
            Clipboard.setString(address);
            showNotification('Copied to clipboard');
          }}
        >
          <Text>Copy account address</Text>
        </Button>
      </Main>
    </Wrapper>
  );
}

import React from 'react';
import { Clipboard } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import styled from '@emotion/native';
import QRCode from 'react-native-qrcode-svg';

import {
  Surface,
  Text,
  SubText,
  DisabledText,
  Icon,
} from 'components/Adaptive';
import Divider from 'components/Divider';
import { showNotification } from 'lib/ui';
import segmentAddress from 'utils/segmentAddress';
import { flatHeader } from 'utils/styles';
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

const TopContainer = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
});

const Main = styled(Surface)({
  paddingVertical: 30,
  paddingHorizontal: 30,
  alignItems: 'center',
  borderRadius: 20,
  elevation: 5,
});

const BottomContainer = styled.View({
  flex: 3,
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

export default function ReceiveScreen({ route }) {
  const address = route.params?.account?.address;
  return (
    <Wrapper
      contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100%',
        paddingVertical: 20,
      }}
    >
      <TopContainer>
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
      </TopContainer>
      <BottomContainer />
    </Wrapper>
  );
}

ReceiveScreen.nav = ({ theme }) => ({
  name: 'Receive',
  options: ({ route }) => ({
    headerTitleAlign: 'center',
    headerTitle: route.params?.account?.name,
    headerStyle: flatHeader(theme),
  }),
});

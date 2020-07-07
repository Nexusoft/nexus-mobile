import React from 'react';
import styled from '@emotion/native';
import { Button } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import SvgIcon from 'components/SvgIcon';
import Text from 'components/Text';
import PinDialog from 'components/PinDialog';
import { goBack } from 'lib/navigation';
import NextIcon from 'icons/next.svg';
import WalletIcon from 'icons/wallet.svg';
import SendIcon from 'icons/send.svg';
import ContactsIcon from 'icons/address-book.svg';

const Wrapper = styled(ScreenBody)({
  paddingVertical: 30,
  paddingHorizontal: 20,
});

const AmountSection = styled.View({
  alignItems: 'center',
  marginBottom: 50,
});

const FromToSection = styled.View({
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 50,
});

const ReferenceSection = styled.View({
  alignItems: 'center',
});

const ButtonSection = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 70,
});

const FromTo = styled.View({
  flex: 1,
  alignItems: 'center',
});

const Amount = styled(Text)({
  fontSize: 36,
});

const Label = styled(Text)({
  fontSize: 18,
  marginBottom: 5,
});

const Name = styled(Text)({
  fontSize: 20,
  marginBottom: 10,
});

const Address = styled(Text)({
  textAlign: 'center',
});

const Arrow = styled.View({
  paddingTop: 38,
  paddingHorizontal: 5,
});

const ReferenceNo = styled(Text)({
  fontSize: 20,
});

const CancelBtn = styled(Button)({
  marginRight: 15,
});

const ConfirmBtn = styled(Button)({
  flex: 1,
});

export default function ConfirmSendScreen() {
  const [confirmingPin, setConfirmingPin] = React.useState(false);
  return (
    <Wrapper surface>
      <AmountSection>
        <Label sub>You're sending</Label>
        <Amount>3,525 NXS</Amount>
      </AmountSection>

      <FromToSection>
        <FromTo>
          <Label sub>From</Label>
          <Name>
            <SvgIcon icon={WalletIcon} size={20} /> default
          </Name>
          <Address mono>
            8BJhfDBEhs73RYmUeM6YRvamRHWP6zjoaSjPRkGbxsFAuiXTuGW
          </Address>
        </FromTo>
        <Arrow>
          <SvgIcon icon={NextIcon} size={16} />
        </Arrow>
        <FromTo>
          <Label sub>To</Label>
          <Name>
            <SvgIcon icon={ContactsIcon} size={20} /> Paul
          </Name>
          <Address mono>
            8C53PdQLuXamTiWw3yXS8fVB4c2eQSwvmssHYzWfLsr5Wtj4jHr
          </Address>
        </FromTo>
      </FromToSection>

      <ReferenceSection>
        <Label sub style={{ fontSize: 16 }}>
          Reference number
        </Label>
        <ReferenceNo>942189</ReferenceNo>
      </ReferenceSection>

      <ButtonSection>
        <CancelBtn
          mode="outlined"
          onPress={() => {
            goBack();
          }}
        >
          Cancel
        </CancelBtn>
        <ConfirmBtn
          mode="contained"
          icon={({ size, color }) => (
            <SvgIcon icon={SendIcon} {...{ size, color }} />
          )}
          onPress={() => {
            setConfirmingPin(true);
          }}
        >
          Send transaction
        </ConfirmBtn>
      </ButtonSection>

      <PinDialog
        visible={confirmingPin}
        onDismiss={() => {
          setConfirmingPin(false);
        }}
      />
    </Wrapper>
  );
}

ConfirmSendScreen.nav = {
  name: 'ConfirmSend',
  options: {
    title: 'Confirm Send',
    // headerShown: false,
  },
};

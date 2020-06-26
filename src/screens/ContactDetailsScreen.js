import React from 'react';
import { Platform, Clipboard } from 'react-native';
import styled from '@emotion/native';
import { Button } from 'react-native-paper';

import ScreenBody from 'components/ScreenBody';
import { Surface, Text, SubText } from 'components/Adaptive';
import SvgIcon from 'components/SvgIcon';
import { showNotification } from 'lib/notifications';
import { lighten, darken } from 'utils/color';
import segmentAddress from 'utils/segmentAddress';
import CopyIcon from 'icons/copy.svg';
import SendIcon from 'icons/send.svg';

const Wrapper = styled(ScreenBody)({
  paddingVertical: 30,
  paddingHorizontal: 30,
});

const ContactInfo = styled.View({
  alignItems: 'center',
  marginBottom: 50,
});

const Avatar = styled.View(({ theme }) => ({
  backgroundColor: theme.dark
    ? lighten(theme.surface, 0.6)
    : darken(theme.surface, 0.15),
  width: 120,
  height: 120,
  borderRadius: 60,
  alignItems: 'center',
  justifyContent: 'center',
}));

const AvatarLetter = styled(SubText)({
  textTransform: 'uppercase',
  fontSize: 63,
});

const ContactName = styled(Text)({
  fontSize: 30,
  marginTop: 20,
});

const AddressLabel = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AddressBox = styled(Surface)(({ theme }) => ({
  // borderWidth: 1,
  // borderColor: disabledColor(theme.foreground),
  borderRadius: 4,
  paddingVertical: 12,
  marginTop: 5,
}));

const Address = styled(Text)({
  fontSize: 15,
  textAlign: 'center',
});

const SendBtn = styled(Button)({
  marginTop: 30,
});

const getinitial = (name) => (name && name.length >= 1 ? name.charAt(0) : '');

export default function ContactDetailsScreen({ route }) {
  const contact = route.params?.contact;
  return (
    <Wrapper>
      <ContactInfo>
        <Avatar>
          <AvatarLetter>{getinitial(contact.name)}</AvatarLetter>
        </Avatar>
        <ContactName>{contact.name}</ContactName>
      </ContactInfo>

      <AddressLabel>
        <SubText>Address</SubText>
        <Button
          mode="text"
          icon={(props) => <SvgIcon icon={CopyIcon} {...props} />}
          labelStyle={{ fontSize: 12 }}
          onPress={() => {
            Clipboard.setString(contact.address);
            showNotification('Copied to clipboard');
          }}
        >
          Copy
        </Button>
      </AddressLabel>
      <AddressBox>
        <Address mono>{segmentAddress(contact.address)}</Address>
      </AddressBox>

      <SendBtn
        mode="text"
        uppercase={false}
        icon={(props) => <SvgIcon icon={SendIcon} {...props} />}
        onPress={() => {}}
      >
        Send to {contact.name}
      </SendBtn>
    </Wrapper>
  );
}

ContactDetailsScreen.nav = {
  name: 'ContactDetails',
  options: {
    title: Platform.OS === 'ios' ? 'Details' : 'Contact Details',
  },
};

import React from 'react';
import styled from '@emotion/native';
import { TouchableRipple } from 'react-native-paper';

import { Text, SubText } from 'components/Adaptive';
import { lighten, darken } from 'utils/color';

const ContactWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const AvatarWrapper = styled.View({
  paddingVertical: 20,
  width: 60,
  alignItems: 'center',
  justifyContent: 'center',
});

const Avatar = styled.View(({ theme }) => ({
  backgroundColor: theme.dark
    ? lighten(theme.surface, 0.6)
    : darken(theme.surface, 0.15),
  width: 40,
  height: 40,
  borderRadius: 25,
  alignItems: 'center',
  justifyContent: 'center',
}));

const AvatarLetter = styled(SubText)({
  textTransform: 'uppercase',
  fontSize: 16,
});

const NameWrapper = styled.View({
  flex: 1,
});

const ContactName = styled(Text)({
  fontSize: 15,
});

const getinitial = (name) => (name && name.length >= 1 ? name.charAt(0) : '');

export default function Contact({ contact, onSelect }) {
  return (
    <TouchableRipple
      onPress={() => {
        onSelect(contact.address);
      }}
    >
      <ContactWrapper>
        <AvatarWrapper>
          <Avatar>
            <AvatarLetter>{getinitial(contact.name)}</AvatarLetter>
          </Avatar>
        </AvatarWrapper>

        <NameWrapper>
          <ContactName>{contact.name}</ContactName>
        </NameWrapper>
      </ContactWrapper>
    </TouchableRipple>
  );
}

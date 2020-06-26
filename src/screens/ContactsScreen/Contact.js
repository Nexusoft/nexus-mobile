import React from 'react';
import styled from '@emotion/native';
import { TouchableRipple } from 'react-native-paper';

import { Text, SubText } from 'components/Adaptive';
import { lighten, darken } from 'utils/color';
import { navigate } from 'lib/navigation';

const ContactWrapper = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const AvatarWrapper = styled.View({
  paddingVertical: 20,
  width: 90,
  alignItems: 'center',
  justifyContent: 'center',
});

const Avatar = styled.View(({ theme }) => ({
  backgroundColor: theme.dark
    ? lighten(theme.surface, 0.6)
    : darken(theme.surface, 0.15),
  width: 50,
  height: 50,
  borderRadius: 25,
  alignItems: 'center',
  justifyContent: 'center',
}));

const AvatarLetter = styled(SubText)({
  textTransform: 'uppercase',
  fontSize: 21,
});

const NameWrapper = styled.View({
  flex: 1,
});

const ContactName = styled(Text)({
  fontSize: 18,
});

const getinitial = (name) => (name && name.length >= 1 ? name.charAt(0) : '');

export default function Contact({ contact }) {
  return (
    <TouchableRipple
      onPress={() => {
        // navigate('ContactDetails', { contact });
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

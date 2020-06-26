import React from 'react';
import { Platform, Clipboard } from 'react-native';
import styled from '@emotion/native';
import { Button } from 'react-native-paper';
import { useTheme } from 'emotion-theming';

import ScreenBody from 'components/ScreenBody';
import { Surface, Text, SubText } from 'components/Adaptive';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import { showNotification } from 'lib/notifications';
import { navigate } from 'lib/navigation';
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

const ContactNameInput = styled(TextBox.Adaptive)({
  alignSelf: 'stretch',
});

const AddressLabelWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const AddressBox = styled(Surface)({
  borderRadius: 4,
  paddingVertical: 12,
  marginTop: 5,
});

const Address = styled(Text)({
  fontSize: 15,
  textAlign: 'center',
});

const Buttons = styled.View({
  marginTop: 40,
  alignItems: 'center',
});

const getinitial = (name) => (name && name.length >= 1 ? name.charAt(0) : '');

export default function ContactDetailsScreen({ navigation, route }) {
  const [editing, setEditing] = React.useState(false);
  const theme = useTheme();
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mode="text"
          color={theme.dark ? theme.primary : theme.onPrimary}
          onPress={() => {
            setEditing(!editing);
          }}
        >
          {editing ? 'Done' : 'Edit'}
        </Button>
      ),
    });
  }, [editing]);
  const contact = route.params?.contact;
  return (
    <Wrapper>
      <ContactInfo>
        <Avatar>
          <AvatarLetter>{getinitial(contact.name)}</AvatarLetter>
        </Avatar>
        {editing ? (
          <ContactNameInput
            style={{ alignSelf: 'stretch' }}
            mode="underlined"
            defaultValue={contact.name}
            label="Contact name"
          />
        ) : (
          <ContactName>{contact.name}</ContactName>
        )}
      </ContactInfo>

      {editing ? (
        <TextBox.Adaptive
          mode="underlined"
          defaultValue={contact.address}
          label="Address"
        />
      ) : (
        <>
          <AddressLabelWrapper>
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
          </AddressLabelWrapper>
          <AddressBox>
            <Address mono>{segmentAddress(contact.address)}</Address>
          </AddressBox>
        </>
      )}

      {editing ? (
        <Button
          mode="contained"
          color={theme.danger}
          style={{ marginTop: 60, alignSelf: 'center' }}
        >
          Delete contact
        </Button>
      ) : (
        <Button
          mode="text"
          uppercase={false}
          icon={(props) => <SvgIcon icon={SendIcon} {...props} />}
          onPress={() => {
            navigate('Send');
          }}
          style={{ marginTop: 30 }}
        >
          Send to {contact.name}
        </Button>
      )}
    </Wrapper>
  );
}

ContactDetailsScreen.nav = {
  name: 'ContactDetails',
  options: {
    title: Platform.OS === 'ios' ? 'Details' : 'Contact Details',
  },
};

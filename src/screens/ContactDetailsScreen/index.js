import React from 'react';
import { Platform, Clipboard } from 'react-native';
import styled from '@emotion/native';
import { Button, IconButton } from 'react-native-paper';
import { useTheme } from 'emotion-theming';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';

import ScreenBody from 'components/ScreenBody';
import { Surface, Text, SubText } from 'components/Adaptive';
import TextBox from 'components/TextBox';
import SvgIcon from 'components/SvgIcon';
import AddressPicker from 'components/AddressPicker';
import { showNotification, showError, confirm } from 'lib/ui';
import { navigate, goBack } from 'lib/navigation';
import { updateContact, deleteContact } from 'lib/contacts';
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

const HeaderIcons = styled.View({
  flexDirection: 'row',
});

const HeaderIcon = styled(IconButton)({
  marginRight: 10,
});

const getinitial = (name) => (name && name.length >= 1 ? name.charAt(0) : '');

function NormalMode({ startEditing }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const contact = route.params?.contact;
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderIcon
          icon="pencil"
          color={theme.dark ? theme.primary : theme.onPrimary}
          onPress={startEditing}
          size={20}
        />
      ),
    });
  }, []);
  return (
    <>
      <ContactInfo>
        <Avatar>
          <AvatarLetter>{getinitial(contact.name)}</AvatarLetter>
        </Avatar>
        <ContactName>{contact.name}</ContactName>
      </ContactInfo>

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
    </>
  );
}

function EditMode({ isSubmitting, endEditing, handleSubmit, setFieldValue }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const contact = route.params?.contact;
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderIcons>
          <HeaderIcon
            disabled={isSubmitting}
            color={theme.dark ? theme.primary : theme.onPrimary}
            icon="close"
            onPress={endEditing}
          />
          <HeaderIcon
            disabled={isSubmitting}
            color={theme.dark ? theme.primary : theme.onPrimary}
            icon="check"
            onPress={handleSubmit}
          />
        </HeaderIcons>
      ),
    });
  }, []);
  return (
    <>
      <ContactInfo>
        <Avatar>
          <AvatarLetter>{getinitial(contact.name)}</AvatarLetter>
        </Avatar>
      </ContactInfo>
      <TextBox.Formik
        name="name"
        label="Contact name"
        autoCapitalize="words"
        style={{ alignSelf: 'stretch', marginBottom: 10 }}
      />
      <TextBox.Formik name="address" label="Address" />
      <AddressPicker
        pickContacts={false}
        setAddress={(address) => {
          setFieldValue('address', address);
        }}
      />
      <Button
        mode="contained"
        color={theme.danger}
        style={{ marginTop: 60, alignSelf: 'center' }}
        onPress={async () => {
          const confirmed = await confirm({
            message: 'Delete contact?',
            confirmLabel: 'Delete',
            danger: true,
          });
          if (confirmed) {
            await deleteContact(contact.name);
            goBack();
          }
        }}
      >
        Delete contact
      </Button>
    </>
  );
}

export default function ContactDetailsScreen({ navigation, route }) {
  const [editing, setEditing] = React.useState(false);
  const contact = route.params?.contact;
  return (
    <Wrapper>
      {editing ? (
        <Formik
          initialValues={{
            name: contact.name || '',
            address: contact.address || '',
          }}
          validationSchema={yup.object().shape({
            name: yup.string().required('Required!'),
            address: yup.string().required('Required!'),
          })}
          onSubmit={async ({ name, address }) => {
            try {
              await updateContact(contact.name, { name, address });
              navigation.setParams({ contact: { name, address } });
              setEditing(false);
            } catch (err) {
              showError(err && err.message);
            }
          }}
        >
          {(props) => (
            <EditMode
              {...props}
              endEditing={() => {
                setEditing(false);
              }}
            />
          )}
        </Formik>
      ) : (
        <NormalMode
          startEditing={() => {
            setEditing(true);
          }}
        />
      )}
    </Wrapper>
  );
}

ContactDetailsScreen.nav = {
  name: 'ContactDetails',
  options: {
    title: Platform.OS === 'ios' ? 'Contact' : 'Contact Details',
  },
};

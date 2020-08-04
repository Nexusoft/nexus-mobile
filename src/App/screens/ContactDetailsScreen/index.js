import React from 'react';
import { Platform, Clipboard, View } from 'react-native';
import { Surface, Button, IconButton } from 'react-native-paper';
import { useTheme } from 'lib/theme';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup';

import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
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

const styles = {
  wrapper: {
    paddingVertical: 30,
    paddingHorizontal: 30,
  },
  mainInfo: {
    alignItems: 'center',
    marginBottom: 50,
  },
  avatar: ({ theme }) => ({
    backgroundColor: theme.dark
      ? lighten(theme.surface, 0.6)
      : darken(theme.surface, 0.15),
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  initLetter: {
    textTransform: 'uppercase',
    fontSize: 63,
  },
  contactName: {
    fontSize: 30,
    marginTop: 20,
  },
  labelLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addressBox: {
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 5,
    elevation: 2,
  },
  address: {
    fontSize: 15,
    textAlign: 'center',
  },
  deleteBtn: {
    marginTop: 60,
    alignSelf: 'center',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginRight: 10,
  },
};

const getinitial = (name) => (name && name.length >= 1 ? name.charAt(0) : '');

function NormalMode({ startEditing }) {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const contact = route.params?.contact;
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          style={styles.headerIcon}
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
      <View style={styles.mainInfo}>
        <View style={styles.avatar({ theme })}>
          <Text style={styles.initLetter} sub>
            {getinitial(contact.name)}
          </Text>
        </View>
        <Text style={styles.contactName}>{contact.name}</Text>
      </View>

      <View style={styles.labelLine}>
        <Text sub>Address</Text>
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
      </View>
      <Surface style={styles.addressBox}>
        <Text style={styles.address} mono>
          {segmentAddress(contact.address)}
        </Text>
      </Surface>

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
        <View style={styles.headerIcons}>
          <IconButton
            style={styles.headerIcon}
            disabled={isSubmitting}
            color={theme.dark ? theme.primary : theme.onPrimary}
            icon="close"
            onPress={endEditing}
          />
          <IconButton
            style={styles.headerIcon}
            disabled={isSubmitting}
            color={theme.dark ? theme.primary : theme.onPrimary}
            icon="check"
            onPress={handleSubmit}
          />
        </View>
      ),
    });
  }, []);
  return (
    <>
      <View style={styles.mainInfo}>
        <View style={styles.avatar({ theme })}>
          <Text style={styles.initLetter} sub>
            {getinitial(contact.name)}
          </Text>
        </View>
      </View>
      <TextBox.Formik
        name="name"
        label="Contact name"
        autoCapitalize="words"
        style={{ alignSelf: 'stretch', marginBottom: 10 }}
      />
      <TextBox.Formik name="address" label="Address" multiline />
      <AddressPicker
        pickContacts={false}
        setAddress={(address) => {
          setFieldValue('address', address);
        }}
      />
      <Button
        style={styles.deleteBtn}
        mode="contained"
        color={theme.danger}
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
    <ScreenBody style={styles.wrapper}>
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
    </ScreenBody>
  );
}

ContactDetailsScreen.nav = {
  name: 'ContactDetails',
  options: {
    title: Platform.OS === 'ios' ? 'Contact' : 'Contact Details',
  },
};

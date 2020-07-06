import React from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { IconButton, Portal, Dialog } from 'react-native-paper';

import { Icon, Text } from 'components/Adaptive';
import Divider from 'components/Divider';
import memoize from 'utils/memoize';
import AddressBookIcon from 'icons/address-book.svg';
import Contact from './Contact';

const styles = {
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  button: {
    marginVertical: 0,
    marginTop: -20,
  },
};

const selectContacts = memoize((state) =>
  Object.entries(state.contacts).map(([name, address]) => ({ name, address }))
);

export default function ContactsSelector({ setAddress }) {
  const [contactsOpen, setContactsOpen] = React.useState(false);
  const contacts = useSelector(selectContacts);
  return (
    <>
      <IconButton
        style={styles.button}
        icon={() => <Icon icon={AddressBookIcon} size={16} />}
        onPress={async () => {
          setContactsOpen(true);
        }}
      />
      <Portal>
        <Dialog
          visible={contactsOpen}
          onDismiss={() => {
            setContactsOpen(false);
          }}
        >
          <Dialog.Title>
            <Text>Choose from contacts</Text>
          </Dialog.Title>
          <Dialog.ScrollArea>
            <FlatList
              data={contacts}
              ItemSeparatorComponent={Divider}
              keyExtractor={(contact) => contact.name}
              renderItem={({ item }) => (
                <Contact
                  contact={item}
                  onSelect={(address) => {
                    setAddress(address);
                    setContactsOpen(false);
                  }}
                />
              )}
            />
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    </>
  );
}

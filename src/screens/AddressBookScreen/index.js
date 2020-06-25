import React from 'react';
import { FlatList } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Divider from 'components/Divider';
import ScreenBody from 'components/ScreenBody';
import memoize from 'utils/memoize';
import AddressBookIcon from 'icons/address-book.svg';
import Contact from './Contact';

const selectContacts = memoize((state) =>
  state.contacts
    ? Object.entries(state.contacts)
        .map(([name, address]) => ({ name, address }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : []
);

export default function AddressBookScreen() {
  const contacts = useSelector(selectContacts);
  return (
    <ScreenBody scroll={false} style={{ paddingVertical: 10 }}>
      <FlatList
        data={contacts}
        ItemSeparatorComponent={Divider}
        keyExtractor={(contact) => contact.name}
        renderItem={({ item }) => <Contact contact={item} />}
      />
    </ScreenBody>
  );
}

AddressBookScreen.nav = {
  name: 'AddressBook',
  icon: AddressBookIcon,
  options: {
    tabBarLabel: 'Address Book',
  },
  stackOptions: {
    title: 'Address Book',
    headerTitleAlign: 'left',
    headerRight: ({ tintColor }) => (
      <IconButton
        icon="magnify"
        color={tintColor}
        size={25}
        onPress={() => {}}
      />
    ),
  },
};

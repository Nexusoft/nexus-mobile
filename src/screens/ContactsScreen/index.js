import React from 'react';
import styled from '@emotion/native';
import { FlatList } from 'react-native';
import { IconButton, FAB } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Divider from 'components/Divider';
import ScreenBody from 'components/ScreenBody';
import { navigate } from 'lib/navigation';
import memoize from 'utils/memoize';
import ContactsIcon from 'icons/address-book.svg';
import Contact from './Contact';

const Wrapper = styled(ScreenBody)({
  paddingBottom: 106,
});

const AddButton = styled(FAB)({
  position: 'absolute',
  right: 30,
  bottom: 30,
});

const selectContacts = memoize((state) =>
  state.contacts
    ? Object.entries(state.contacts)
        .map(([name, address]) => ({ name, address }))
        .sort((a, b) => a.name.localeCompare(b.name))
    : []
);

export default function ContactsScreen() {
  const contacts = useSelector(selectContacts);
  return (
    <Wrapper scroll={false} style={{ paddingVertical: 10 }}>
      <FlatList
        data={contacts}
        ItemSeparatorComponent={Divider}
        keyExtractor={(contact) => contact.name}
        renderItem={({ item }) => <Contact contact={item} />}
      />
      <AddButton
        icon="plus"
        onPress={() => {
          navigate('NewContact');
        }}
      />
    </Wrapper>
  );
}

ContactsScreen.nav = {
  name: 'Contacts',
  icon: ContactsIcon,
  options: {
    tabBarLabel: 'Contacts',
  },
  stackOptions: {
    title: 'Contacts',
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

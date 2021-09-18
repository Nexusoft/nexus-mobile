import React from 'react';
import { View, FlatList } from 'react-native';
import { IconButton, FAB, Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Divider from 'components/Divider';
import ScreenBody from 'components/ScreenBody';
import Text from 'components/Text';
import TextBox from 'components/TextBox';
import { navigate } from 'lib/navigation';
import { setContactSearch } from 'lib/ui';
import { selectSetting, updateSettings } from 'lib/settings';
import { useTheme, disabledColor } from 'lib/theme';
import memoize from 'utils/memoize';
import Contact from './Contact';

const styles = {
  wrapper: {
    paddingBottom: 106,
  },
  descBox: ({ theme }) => ({
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: disabledColor(theme.foreground),
    borderRadius: 4,
  }),
  descText: {},
  descButton: {
    alignSelf: 'flex-end',
  },
  addBtn: {
    position: 'absolute',
    right: 30,
    bottom: 30,
  },
  emptyMessage: {
    marginTop: 50,
    textAlign: 'center',
  },
  emptyAddBtn: {
    marginTop: 30,
  },
};

const selectContacts = memoize(
  (contacts) =>
    contacts
      ? Object.entries(contacts)
          .map(([name, contact]) => ({ name, ...contact }))
          .sort((a, b) => a.name.localeCompare(b.name))
      : [],
  (state) => [state?.contacts]
);

const filterContacts = memoize((contacts, keyword) => {
  const kw = keyword.toLowerCase();
  return contacts.filter((contact) => contact.name.toLowerCase().includes(kw));
});

function NoContacts() {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text sub style={styles.emptyMessage}>
        You don't have any contact yet
      </Text>
      <FAB
        style={styles.emptyAddBtn}
        icon="plus"
        onPress={() => {
          navigate('NewContact');
        }}
        label="Add contact"
      />
    </View>
  );
}

function NoResults() {
  return (
    <View>
      <Text sub style={styles.emptyMessage}>
        No matching results
      </Text>
    </View>
  );
}

export default function ContactsScreen() {
  const theme = useTheme();
  const contacts = useSelector(selectContacts);
  const showContactsTip = useSelector(selectSetting('showContactsTip'));
  const search = useSelector((state) => state.ui.contactSearch);
  const filteredContacts =
    search && typeof search === 'string'
      ? filterContacts(contacts, search)
      : contacts;

  return (
    <ScreenBody
      style={styles.wrapper}
      scroll={false}
      style={{ paddingVertical: 10 }}
    >
      {showContactsTip && (
        <View style={styles.descBox({ theme })}>
          <Text sub style={styles.descText}>
            Contacts are stored locally on this phone and not bound to any
            individual user. Therefore, anyone who logs in to this app on this
            phone would see the same contacts.
          </Text>
          <Button
            compact
            style={styles.descButton}
            labelStyle={{ fontSize: 12 }}
            onPress={() => {
              updateSettings({ showContactsTip: false });
            }}
          >
            I got it
          </Button>
        </View>
      )}
      <FlatList
        data={filteredContacts}
        ItemSeparatorComponent={Divider}
        keyExtractor={(contact) => contact.address}
        renderItem={({ item }) => <Contact contact={item} />}
        ListEmptyComponent={contacts?.length ? NoResults : NoContacts}
      />
      {!!contacts?.length && (
        <FAB
          style={styles.addBtn}
          icon="plus"
          onPress={() => {
            navigate('NewContact');
          }}
        />
      )}
    </ScreenBody>
  );
}

ContactsScreen.nav = ({ contactSearch, theme }) => ({
  name: 'Contacts',
  options: {
    title: 'Contacts',
    headerTitle:
      typeof contactSearch === 'string'
        ? () => (
            <TextBox
              background={theme.dark ? 'surface' : 'primary'}
              value={contactSearch}
              onChangeText={setContactSearch}
              autoFocus
              dense
              placeholder="Search contact"
            />
          )
        : 'Contacts',
    // headerTitleAlign: 'left',
    headerRight:
      typeof contactSearch === 'string'
        ? ({ tintColor }) => (
            <IconButton
              icon="close"
              color={tintColor}
              size={25}
              onPress={() => {
                setContactSearch(null);
              }}
            />
          )
        : ({ tintColor }) => (
            <IconButton
              icon="magnify"
              color={tintColor}
              size={25}
              onPress={() => {
                setContactSearch('');
              }}
            />
          ),
  },
  // listeners: {
  //   blur: () => {
  //     if (typeof contactSearch === 'string') {
  //       setContactSearch(null);
  //     }
  //   },
  // },
});

import { AsyncStorage } from 'react-native';

import * as TYPE from 'consts/actionTypes';
import { getStore } from 'store';

export const defaultSettings = {
  darkMode: false,
  baseCurrency: 'USD',
};

export async function loadContacts() {
  const contacts = JSON.parse(await AsyncStorage.getItem('contacts'));
  return contacts;
}

export async function addContact({ name, address }) {
  const store = getStore();
  const { contacts } = store.getState();
  const newContacts = { ...contacts, [name]: address };

  store.dispatch({
    type: TYPE.SET_CONTACTS,
    payload: newContacts,
  });

  return await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
}

export async function editContact(oldName, { name, address }) {
  const store = getStore();
  const { contacts } = store.getState();
  const newContacts = { ...contacts };
  if (oldName !== name) {
    delete newContacts[oldName];
  }
  newContacts[name] = address;

  store.dispatch({
    type: TYPE.SET_CONTACTS,
    payload: newContacts,
  });

  return await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
}

export async function deleteContact(name) {
  const store = getStore();
  const { contacts } = store.getState();
  const newContacts = { ...contacts };
  delete newContacts[name];

  store.dispatch({
    type: TYPE.SET_CONTACTS,
    payload: newContacts,
  });

  return await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
}

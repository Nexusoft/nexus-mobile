import { loadSettings } from 'lib/settings';
import { loadContacts } from 'lib/contacts';

export default async function loadInitialState() {
  const [settings, contacts] = await Promise.all([
    loadSettings(),
    loadContacts(),
  ]);

  return {
    settings,
    contacts,
  };
}
